# Zero-Knowledge Task Verification Simulation

A modern, full-stack, interactive cryptography demonstration. This project showcases **Zero-Knowledge Proofs (ZKP)** in cooperative multi-agent systems.

Built for the **Cryptography and Network Security** presentation.
**Team Member:** Radhika Agrawal (23BCE5021)

---

## 📖 Project Context: What are we simulating?

Imagine two computer programs (Agents) talking:
**Computer A (Observer):** Possesses heavily guarded secrets. For example, it navigated a highly confidential maze full of hidden traps safely.
**Computer B (Verifier):** Needs to verify and prove that Computer A truly has a safe path, but **Computer A refuses to show the maze or its coordinates** due to data privacy.

**How do you prove a statement is true, without revealing the secret data itself?**
We use a **Zero-Knowledge Proof (ZKP)**. Traditional verification forces the Observer to reveal their path. This project enforces that the Observer proves they met all constraints mathematically using Cryptographic Hashes replacing sensitive mapping data.

### Expected Outcomes Demonstrated
- **Privacy-Preserving Verification**: Task completion verified without revealing the underlying data.
- **Lightweight Proofing Mechanics**: Built using universally available cryptographic primitives (SHA-256, HMAC) instead of computationally taxing SNARKs.
- **Robust Security**: Integrates network protocol protections like Challenge/Response Nonces and Replay Log validation.

---

## ⚙️ How to Download and Run This Project

This project requires **[Node.js](https://nodejs.org/)** to be installed on your computer.

### Step 1: Clone the Repository
Download the project to your local machine:
```bash
git clone https://github.com/AnshadityaSharma/zero_knowledge_proof.git
cd zero_knowledge_proof
```

*(Note: There are two separate folders: `frontend` and `backend`. You must run both at the same time in two separate terminal windows).*

---

### Step 2: Start the Cryptographic Backend Node
The backend simulates the mathematical proofs, SHA-256 hash generation, and constraint validation.

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies (Express, CORS):
   ```bash
   npm install
   ```
3. Start up the server:
   ```bash
   node server.js
   ```
*You should see a message saying `Server running on port 5000`.*

---

### Step 3: Start the React Frontend Dashboard
The frontend displays the interactive simulation and handles network communication logic.

1. Open a **New, Separate Terminal Window**, and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the User Interface dependencies (React, Vite, Axios, Lucide-React):
   ```bash
   npm install
   ```
3. Boot up the Vite Development Server:
   ```bash
   npm run dev
   ```
*The command prompt will show a local URL, typically `http://localhost:5173`. Hold `Ctrl` and click that link, or paste it into your web browser.*

---

## 🚀 How to Use the Interactive Dashboard

Once your browser is open with the application, you can step through the Cryptographic Simulation directly:

**Phase 1: COMMIT (Observer Agent)**
- **Click: Generate & Commit**
- *What happens:* The Observer internally generates a 4x4 matrix, hides traps, traces a safe path, and compiles it. Rather than broadcasting the path, it runs it through a `SHA-256 Hash Function` blended with a `CSPRNG Nonce`, and dispatches the Hash Commitment over the Network Channel.

**Phase 2: CHALLENGE (Verifier Agent)**
- **Click: Issue Query**
- *What happens:* The Verifier acknowledges the Commitment Hash, but needs to test the Observer to make sure they aren't reusing old paths. The Verifier produces a completely random 64-bit Hex Challenge string and sends it to the Observer.

**Phase 3: RESPOND (Observer Agent)**
- **Click: Compute MAC ZKP**
- *What happens:* Now forced to prove knowledge against the unguessable Challenge, the Observer uses `HMAC-SHA256`. It signs the Challenge query using its original secret mapping constraints as the key, generating an undisputable cryptographic Proof without revealing the source key.

**Phase 4: VERIFY (Verifier Agent)**
- **Click: Audit Proof**
- *What happens:* The Verifier receives the HMAC Proof and recalculates the structural integrity of the math. If it aligns to the original Hash and the constraints are met, the Verifier accepts the transmission without *ever* learning the literal array positions of the traps!

---

## 🏗️ Technical File Structure

If you wish to dig through the code base:

```text
zero_knowledge_proof/
│
├── frontend/                 # Interactive React UI Simulator
│   ├── src/
│   │   ├── components/       # Interface Sub-Panels
│   │   │   ├── ContextInfo.jsx    # Introduction Explanations
│   │   │   ├── ObserverAgent.jsx  # Observer State Machine & UI
│   │   │   ├── VerifierAgent.jsx  # Verifier State Machine & UI
│   │   │   ├── NetworkChannel.jsx # Animated Datagram Packet Visualizer
│   │   │   ├── LogsPanel.jsx      # Bottom Terminal Emulation
│   │   │   └── Map.jsx            # 4x4 Grid Generator
│   │   ├── index.css         # Custom Premium Glass Theme
│   │   └── App.jsx           # Master Control & State Machine
│   └── package.json
│
└── backend/                  # NodeJS Cryptographic Evaluator
    ├── crypto/
    │   └── zkp.js            # SHA-256 Commitments & HMAC generation algorithms
    ├── protocol/
    │   └── verifier.js       # Secret Map Simulation constraints
    ├── server.js             # API Simulation Routes (Port 5000)
    └── package.json
```
