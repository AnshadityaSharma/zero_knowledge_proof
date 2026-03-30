# Zero-Knowledge Proof (ZKP) Task Verification - Architecture & Codebase Guide

This document is a complete walkthrough of the **Zero-Knowledge Task Verification Simulation** codebase. Use this guide if you need to understand how the internal code actually functions, how the cryptography works, or if you need to explain the project architecture.

---

## 1. High-Level Architecture

The project is split into two independent domains interacting with each other via HTTP REST API.

1. **`backend/` (Node.js + Express):** Acts as the authoritative "Simulation Engine." It literally performs the cryptographic Math, utilizes BFS (Breadth-First Search) graph-traversal to find valid maze routes, handles the memory state between phases, and generates the hidden maps based on custom inputs.
2. **`frontend/` (React + Vite):** Acts as the visual "Dashboard." It has no idea what the secret answers are; it only issues commands to the backend API, generates interactive UI constraints, and elegantly visualizes the mathematical state changes (like the Live Entropy Hash mapping).

---

## 2. Exploring the Backend Code (`/backend`)

The backend holds the magic of the Cryptography execution and maze path validation. It's built cleanly into modular files.

### `backend/server.js`
This is the root API server running on **Port 5000**. It has a central `app.post()` route for every one of the 4 steps of the ZKP protocol:

1. **`/api/generate-task`:** 
   Creates a new simulation environment. Crucially, it accepts custom user-defined **Start (x,y)**, **Goal (x,y)**, and **Trap array** coordinates from the frontend payload. It uses a **BFS algorithm** to analytically verify the grid is solvable. If blocked, it returns an explicit unsolvable error. Otherwise, it compiles the maze and replies with the initial `commitment` Hash and `nonce`.
2. **`/api/challenge`:**
   Simulates the Verifier requesting proof. It randomly generates a 64-bit hex `challenge` and replies with it.
3. **`/api/proof`:**
   The Observer agent calculates the ZKP HMAC proof. 
4. **`/api/verify`:**
   The Verifier agent receives the Observer's proof and evaluates whether it mathematically passes the Constraint rules.

### `backend/crypto/zkp.js`
This is the absolute core of the **Cryptography Simulation**. It imports Node's native `crypto` library to execute the protocol logic.
* **`generateNonce()`:** Creates a 16-byte random salt.
* **`generateCommitment()`:** SHA-256 Hiding Phase mechanism binding the Observer without revealing the answer.
* **`generateProof()`:** Simulates a Fiat-Shamir proof using **HMAC-SHA256**.
* **`verifyHMACProof()`:** Verifies the cryptographic authenticity.

### `backend/protocol/verifier.js`
Contains mathematical domain logic, grid generation, and the exact path validating mechanisms (like `simulateEnvironment()` and the Breadth-First traversal logic).

---

## 3. Exploring the Frontend Code (`/frontend`)

The frontend is built purely using **React** and styled powerfully using vanilla modern CSS (no Tailwind or bootstrap bloat).

### `frontend/src/App.jsx`
This is the master **State Machine**. It maintains the master protocol `step` (0 through 4), coordinates all REST API handshakes using `axios`, and feeds the respective `cryptoData` downward to visualizing child components.

### `frontend/src/index.css`
Contains an editorial-grade design system:
* Defines **Space Grotesk** typography formatting.
* Renders premium styling elements (like the deep glowing rings across states).
* Houses `trap-panel-columns` flex logic for side-by-side configurations.

### Advanced Components Breakdown (`/frontend/src/components/`)
1. **`TrapConfigurator.jsx`:** A fully interactive configuration panel that pushes `startPos`, `goalPos`, and `customTraps` arrays back to `App.jsx`. It supports algorithmic randomization, preset loading, and click-to-edit 4x4 coordinate grids.
2. **`HashEntropyVisualizer.jsx`:** The "Live Hash Entropy Field" that parses dynamic 256-bit cryptography and graphically routes them into either chaotic unstructured scattered particles (when computing/idle) or into a perfectly unified symmetrical geometric ring upon successful cryptographic ZKP verification.
3. **`NetworkChannel.jsx`:** The animated middle channel bridging the two agents. It physically stacks incoming packets sequentially containing metadata representing the `COMMIT`, `CHALLENGE`, and `RESPONSE` packet payloads.
4. **`ObserverAgent.jsx` & `VerifierAgent.jsx`:** The respective pink and cyan agent boxes executing map visualization rules.
5. **`LetterGlitch.jsx`:** A subtle, high-tech animated background matrix effect layered flawlessly behind the main container.

---

## 4. Summary of the Real ZKP Protocol Flow

When presenting, walk through this exact technological stream:

1. **(Frontend) `App.jsx: TrapConfigurator`** commits custom grid parameters.
2. **(Backend) `server.js: /api/generate-task`** receives parameters, runs BFS route-finding algorithm to validate the maze mathematically (`verifier.js`).
3. **(Backend) `zkp.js`** hashes the Secret Traps using SHA-256 to create a one-way `commitment` fingerprint.
4. **(Frontend)** Network Channel visualizes the stacked Commitment hash heading to the Verifier.
5. **(Frontend) `App.jsx: handleRequestChallenge()`** is clicked.
6. **(Backend) `server.js: /api/challenge`** creates a random hex CSPRNG security token.
7. **(Frontend)** Network Channel visualizes the random Hex Token heading back to the Observer.
8. **(Frontend) `App.jsx: handleGenerateProof()`** is clicked.
9. **(Backend) `zkp.js: generateProof()`** calculates an HMAC token authenticating the Secret Data dynamically against the Challenge key.
10. **(Frontend) `App.jsx: handleVerify()`** is clicked.
11. **(Backend) `server.js: /api/verify`** mathematically tests the HMAC. Upon success, the Live Entropy Visualizer dynamically maps chaotic hashes into a resolved ring.
