# Zero-Knowledge Proof (ZKP) Task Verification - Codebase Guide

This document is a complete walkthrough of the **Zero-Knowledge Task Verification Simulation** codebase. Use this guide if you need to understand how the internal code actually functions, how the cryptography works, or if you need to explain the project architecture to a professor or peer.

---

## 1. High-Level Architecture

The project is split into two independent domains interacting with each other via HTTP REST API.

1. **`backend/` (Node.js + Express):** Acts as the authoritative "Simulation Engine." It literally performs the cryptographic Math, handles the memory state between phases, and builds out the hidden maps.
2. **`frontend/` (React + Vite):** Acts as the visual "Dashboard." It has no idea what the secret answers are; it only issues commands to the backend API and visualizes the Hash tokens it receives on screen.

---

## 2. Exploring the Backend Code (`/backend`)

The backend holds the magic of the Cryptography execution. It's built cleanly into modular folders.

### `backend/server.js`
This is the root API server running on **Port 5000**. It has a central `app.post()` route for every one of the 4 steps of the ZKP protocol:

1. **`/api/generate-task`:** 
   Creates a new simulation environment. Crucially, it calculates the **Map Traps** and internally tests if the Observer crossed successfully. *It only replies to the frontend with the `commitment` Hash and a generated `nonce`.*
2. **`/api/challenge`:**
   Simulates the Verifier requesting proof. It randomly generates a 64-bit hex `challenge` and replies with it.
3. **`/api/proof`:**
   The Observer agent calculates the ZKP HMAC proof. 
4. **`/api/verify`:**
   The Verifier agent receives the Observer's proof and evaluates whether it mathematically passes the Constraint rules.

---

### `backend/crypto/zkp.js`
This file is the absolute core of the **Cryptography Simulation**. It imports Node's native `crypto` library to execute the protocol logic.

* **`generateNonce()`:** 
  Creates a 16-byte random hex string. This acts as a random salt so that the same map path doesn't result in the same identical hash every time (thwarting attackers trying to guess the path).
* **`generateCommitment(solution, nonce)`:**
  This uses `crypto.createHash('sha256')`. This acts as the *Hiding Phase* mechanism in ZKP. The Observer binds themselves to a specific answer without showing it.
* **`generateProof(secretSolution, challenge, timestamp)`:**
  Since true SNARKs (Complex Math Polynomials) are too heavy for a simple demo, we simulate Fiat-Shamir non-interactive proofs using **HMAC-SHA256**. The original `secretSolution` is signed against the newly provided `challenge` key. 
* **`verifyHMACProof()`:**
  The Verifier assesses the HMAC proof returned to verify its authenticity.

---

### `backend/protocol/verifier.js`
This handles the "Game/Task Constraints" portion. Before cryptography can run, we need to know what task is being evaluated.
* **`simulateEnvironment()`:** Randomly designates a 4x4 Grid, a Start coordinate, a Goal coordinate, and highly secret Trap coordinates.
* **`validatePathConstraints(path, traps)`:** A simple loop function that iterates over every coordinate executed by the Observer to ensure they never physically touched any Trap indices. If this passes, the Observer feels confident generating their Hash commitment.

---

## 3. Exploring the Frontend Code (`/frontend`)

The frontend is built using **React**. It maintains beautiful "Agents" panels and fires off commands via `axios`.

### `frontend/src/App.jsx`
This is your master **State Machine**. It holds the data representing what step of the Protocol the user is currently looking at (`const [step, setStep] = useState(0);`). 

Whenever a user clicks a button (e.g., *Generate Task*), the function `handleGenerateTask()` contacts `localhost:5000/api/generate-task`. When it gets a response, it pushes an update to `cryptoData.commitment` and advances the layout to `step 1`. 
*It also pushes live terminal tracking messages into the Log system using `addLog()`!*

### `frontend/src/index.css`
This file contains all formatting. 
There is no Tailwind or Bootstrap. The UI relies strictly on raw vanilla CSS configurations:
* **`--bg-gradient`**: Forms the beautiful deep-slate galaxy background.
* **`.agent-col` & `.module`**: Implements the advanced `backdrop-filter: blur(20px)` setting allowing the translucent glassmorphism look to work.

### Component Breakdown (`/frontend/src/components/`)
To keep the React code highly readable, everything was broken into unique isolated components:

1. **`ContextInfo.jsx`:** The introductory explanation at the top of the webpage.
2. **`ObserverAgent.jsx`:** The left-hand panel utilizing Pink highlights. Displays the Observer's internal path map and Commitment hashes. It only holds the buttons for Phase 1 and Phase 3. 
3. **`VerifierAgent.jsx`:** The right-hand panel utilizing Cyan highlights. It renders a "Blind Map" where traps are hidden by a grey `?` mark. It holds buttons to dispatch Challenges and execute Verifications (Phases 2 & 4).
4. **`Map.jsx`:** A dynamic `<div className="map-grid">` abstraction. If an Observer calls it, it colors in the Traps. If a Verifier calls it, it applies CSS classes to hide the truth!
5. **`NetworkChannel.jsx`:** The animated middle channel bridging the two agents. Depending on what `step` State the App is in, it will show an `<ArrowRight />` or `<ArrowLeft />` moving a translucent packet box up and down with CSS keyframes to simulate a secure connection link.
6. **`LogsPanel.jsx`:** Renders at the bottom, auto-scrolling terminal simulation keeping track of exactly what logic the NodeJS server processes.

---

## Summary of the Protocol Flow in Code

When someone asks "How does it work?", explain this specific execution chain:

1. **(Frontend) `App.jsx: handleGenerateTask()`** is clicked.
2. **(Backend) `server.js: /api/generate-task`** generates the secret Traps (`verifier.js`).
3. **(Backend) `zkp.js`** hashes the Secret Traps using SHA-256 to create a `commitment` string.
4. **(Frontend)** Map updates, Network packet UI visualizes the Commitment hash heading to the Verifier.
5. **(Frontend) `App.jsx: handleRequestChallenge()`** is clicked.
6. **(Backend) `server.js: /api/challenge`** creates a random hex token.
7. **(Frontend)** Network packet UI visualizes the random Hex Token heading back to the Observer.
8. **(Frontend) `App.jsx: handleGenerateProof()`** is clicked.
9. **(Backend) `zkp.js: generateProof()`** produces an HMAC token mixing the Secret Data and the Challenge hex.
10. **(Frontend) `App.jsx: handleVerify()`** is clicked.
11. **(Backend) `server.js: /api/verify`** checks the math behind the HMAC. If it's pure, we conclude the Zero Knowledge parameters were met!
