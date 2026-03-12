const express = require('express');
const cors = require('cors');
const { generateNonce, generateCommitment, generateProof, verifyHMACProof, generateChallenge } = require('./crypto/zkp');
const { simulateEnvironment, validatePathConstraints } = require('./protocol/verifier');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory persistent state (simulation)
let currentTask = null;
let currentCommitment = null;
let currentChallenge = null;

app.get('/', (req, res) => {
  res.send('Zero-Knowledge Task Verification API is running.');
});

// Step 1: Generate Task and Observer finds a hidden solution
app.post('/api/generate-task', (req, res) => {
  // Simulate an environment with start, goal, and hidden traps
  const environment = simulateEnvironment();
  
  // A valid path found by the Observer (kept secret)
  const secretPath = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 2, y: 0},
    {x: 2, y: 1},
    {x: 2, y: 2} // Goal
  ];
  
  // Verify internally before committing
  const isValid = validatePathConstraints(secretPath, environment.traps);
  
  if (!isValid) {
    return res.status(400).json({ error: "Failed to find a valid constraint-satisfying path." });
  }

  const nonce = generateNonce();
  const pathString = JSON.stringify(secretPath);
  
  // Observer hashes the valid solution along with nonce
  const commitment = generateCommitment(pathString, nonce);

  currentTask = {
    environment,
    secretPath: pathString,
    nonce,
    timestamp: Date.now()
  };
  currentCommitment = commitment;

  res.json({
    message: "Task generated. Observer has a computed hidden path.",
    commitment,
    nonce, // Returned for UI visualization only; normally kept secret by Observer until verification phase
    environment // Send to UI for drawing the map
  });
});

// Step 2: Request Challenge from Verifier
app.post('/api/challenge', (req, res) => {
  if (!currentCommitment) {
    return res.status(400).json({ error: "No commitment exists. Generate a task first." });
  }
  
  // Verifier creates a random challenge
  currentChallenge = generateChallenge();
  
  res.json({
    challenge: currentChallenge,
    message: "Verifier issued a cryptographic challenge."
  });
});

// Step 3: Observer Generates Proof
app.post('/api/proof', (req, res) => {
  if (!currentChallenge || !currentTask) {
    return res.status(400).json({ error: "Missing challenge or state." });
  }

  // Observer generates a zero-knowledge proof response using HMAC
  // The proof combines the original secret, the challenge, and a sequence number
  // In a real ZKP, this would be a transcript or polynomial evaluation
  // Here we use Fiat-Shamir heuristic inspired HMAC to simulate the non-interactive conversion
  // We use HMAC-SHA256 of the path + challenge to prove knowledge
  const proof = generateProof(currentTask.secretPath, currentChallenge, currentTask.timestamp);

  res.json({
    proof,
    message: "Observer produced proof without revealing the raw path."
  });
});

// Step 4: Verifier Validates the Proof
app.post('/api/verify', (req, res) => {
  const { proof } = req.body;
  
  if (!proof || !currentChallenge || !currentTask) {
    return res.status(400).json({ error: "Missing required verification data." });
  }

  // Verifier checks constraints through cryptographic validation
  // In simulation, we verify the HMAC signature of the proof matches expected format
  const isVerified = verifyHMACProof(proof, currentTask.secretPath, currentChallenge, currentTask.timestamp);

  // We ensure to add a "Constraint Verification" simulation:
  const isPathValid = validatePathConstraints(JSON.parse(currentTask.secretPath), currentTask.environment.traps);

  if (isVerified && isPathValid) {
    res.json({
      verified: true,
      result: "Verification Successful! The proof is mathematically sound and task constraints are met.",
      details: "The Verifier validated the proof against the challenge without revealing the path."
    });
  } else {
    res.json({
      verified: false,
      result: "Verification Failed! The proof is invalid or constraint violation detected.",
      details: "The proof failed Cryptographic Challenge Validation."
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
