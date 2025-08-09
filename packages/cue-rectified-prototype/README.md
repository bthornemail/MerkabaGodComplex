# CUE - The Final Rectified Prototype

This project is a comprehensive, multi-process Node.js application demonstrating the final, hardened architecture of the Computational Universe Engine. This version integrates all advanced concepts into a single, cohesive, and runnable prototype.

## Features Implemented

* **Real Cryptography**: ED25519 keypairs and message signing.
* **State Persistence**: Each peer saves its identity and state to a local JSON file.
* **Service Discovery**: Uses a `libp2p` DHT via a bootstrap node.
* **Poly-Axiomatic Consensus**: A multi-level validation system using multi-prime checks and the Rectification Law (`delta % 24 === 0`).
* **Universal Binary Hypergraph Protocol (UBHP)**:
  * **Canonical S-expressions**: All data is represented as self-describing, executable binary ArrayBuffers.
  * **Harmonic Signatures**: Data is transformed into perceptual "vibrations" for content addressing and geometric analysis.
* **Continuous Axiomatic Rectification (CAR)**:
  * The CUE's core consensus mechanism, ensuring continuous, emergent, and verifiable truth.
  * Leverages **Geometric Consensus** for deterministic proofs.
  * Utilizes **Dynamic Proof Difficulty** based on consensus level.
  * Includes **Proof Expiration** and **Proof Revocation**.
* **Secure & Fair Compute Economy**:
  * **WASM Sandbox**: Untrusted code is executed safely.
  * **Gas Metering**: Prevents infinite loops and resource abuse.
  * **Reputation System**: Providers build reputation based on successful, efficient job execution.
* **Agentic Autonomy Example**: A Smart Thermostat Agent that uses WASM logic and CUE events to autonomously maintain a desired temperature.
* **Conceptual Testing Framework**: A simple test runner to ensure the correctness of core components.

## How to Run

The easiest way to see the CUE system in action is with the integrated demo:

### Quick Demo

```bash
# Install dependencies and run the demo
npm install
npm run demo
```

This will demonstrate all the key features of the CUE system in a single integrated simulation.

### What You'll See

The demo shows:
- **Peer Network Formation**: Multiple peers connecting to form a distributed network
- **Cryptographic Security**: All events are signed and verified using RSA signatures
- **Axiomatic Consensus**: Events are validated using multi-prime harmonic checks
- **Consensus Levels**: Different validation rigor for LOCAL vs GLOBAL events  
- **Token Economy**: Minting and payment token systems
- **Compute Jobs**: Secure execution of WASM-like computations
- **Autonomous Agents**: Smart thermostat responding to temperature changes
- **Continuous Axiomatic Rectification**: Background consensus proofs

### Individual Node Execution (Advanced)

You can also run individual nodes separately, though they work best together:

```bash
npm run build
npm run start:bootstrap  # Start bootstrap node
npm run start:provider   # Start compute provider  
npm run start:client     # Start client node
npm run start:agent      # Start thermostat agent
```

Note: The individual nodes are simplified for this demo and don't have full peer-to-peer networking implemented.