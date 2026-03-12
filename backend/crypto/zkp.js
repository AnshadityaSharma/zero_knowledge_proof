const crypto = require('crypto');

/**
 * ZKP Crypto Primitives
 * Simulated for Zero-Knowledge Task Verification
 */

// CSPRNG: Used for generating secure nonces
function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

// SHA-256: Used for hash commitments
function generateCommitment(solution, nonce) {
  const hash = crypto.createHash('sha256');
  // commitment = SHA256(solution + nonce)
  hash.update(solution + nonce);
  return hash.digest('hex');
}

// Generate Challenge for the Verifier
function generateChallenge() {
  return crypto.randomBytes(8).toString('hex');
}

// Fiat–Shamir Heuristic (Simulated)
// Convert interactive zero-knowledge proofs to non-interactive using HMAC-SHA256
// HMAC(challenge, solution + timestamp) serves as proof
function generateProof(secretSolution, challenge, timestamp) {
  // Use challenge as key to HMAC secret to prove possession of secret.
  const hmac = crypto.createHmac('sha256', challenge);
  hmac.update(secretSolution + timestamp);
  return hmac.digest('hex');
}

// Verifier checks HMAC Proof and structure without the actual secret if simulated
function verifyHMACProof(proof, secretPathContent, challenge, timestamp) {
  // In a real ZKP, this would be validating the signature without having secretPathContent
  // Since it's a demonstration project, we reproduce the HMAC verification over simulated path
  // Verifier computes mathematical constraints
  const computedProof = generateProof(secretPathContent, challenge, timestamp);
  return crypto.timingSafeEqual(Buffer.from(proof, 'hex'), Buffer.from(computedProof, 'hex'));
}

module.exports = {
  generateNonce,
  generateCommitment,
  generateChallenge,
  generateProof,
  verifyHMACProof
};
