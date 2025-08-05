
# **CUE Protocol: A Formal Technical Specification**

**Version 1.2**

### **Abstract**

This document provides the complete technical specification for implementing a compliant node (a "Peer") on the Computational Universe Engine (CUE) network. The objective of this specification is to provide an unambiguous blueprint for developers, ensuring interoperability and adherence to the protocol's core axiomatic principles. It details the required data structures via Protocol Buffers, the P2P networking stack based on `libp2p`, cryptographic standards, and the formal algorithms for the `onTick` event processing protocol.

### **1. Introduction**

The CUE Protocol specifies a decentralized peer-to-peer network where each node is a sovereign, stateful agent. All state transitions are governed by a deterministic event processing protocol named `onTick`, which ensures universal integrity through a hierarchical, poly-axiomatic validation framework.

### **2. Data Structures: Protocol Buffer Schema**

All data structures exchanged between peers MUST conform to the following Protocol Buffer (Protobuf 3) schemas. This ensures language-agnostic interoperability.

#### **File: `cue.proto`**

```protobuf
syntax = "proto3";

package cue.protocol;

// Represents the complete state of a peer. This object is maintained locally.
message ComponentState {
  // The peer's unique identifier (ED25519 public key in PEM format).
  string id = 1;

  // Represents the peer's position in the universal clock.
  message Position {
    uint64 domain = 1;
    uint64 dimension = 2;
  }
  Position position = 2;

  // The peer's local knowledge graph (ledger).
  // The key is the unique identifier of the state (e.g., a tokenId).
  // The value is the serialized state data (e.g., a TokenState message).
  map<string, bytes> context = 3;

  // A quantifiable measure of the peer's internal complexity or "computational debt."
  // See Section 5.4 for the formal definition and update algorithm.
  uint64 internal_magnitude = 4;
}

// Represents a digital asset within the CUE.
message TokenState {
  string token_id = 1;
  string owner_credential_id = 2;
  message Metadata {
    string name = 1;
    string description = 2;
  }
  Metadata metadata = 3;
}

// Represents a request to transfer a token.
message TransferToken {
    string token_id = 1;
    string recipient_credential_id = 2;
}

// The wrapper for any event payload.
message ExternalSignal {
  // Defines the consensus level and validation rigor required.
  enum ConsensusLevel {
    LOCAL = 0;        // An action affecting only the originating peer's state.
    PEER_TO_PEER = 1; // Requires Modulus 2 check.
    GROUP = 2;        // Requires Modulus 7 check.
    GLOBAL = 3;       // Requires Modulus 24 check.
  }
  ConsensusLevel level = 1;

  uint64 timestamp = 2; // UTC milliseconds since epoch.

  // The payload can be one of several event types.
  oneof payload {
    TokenState mint_token = 3;
    TransferToken transfer_token = 4;
    bool rectify_state = 5; // Payload is just a boolean flag.
  }
}

// The top-level message propagated through the network.
message SignedMessage {
  // The ExternalSignal message, serialized to bytes.
  bytes payload = 1;
  // The public key of the sender.
  string source_credential_id = 2;
  // The ED25519 signature of the payload bytes, encoded in Base64.
  string signature = 3;
}
```

### **3. Cryptography & Identity Specification**

*   **Algorithm:** All peers MUST use the **ED25519** signature algorithm.
*   **Key Format:** Keypairs MUST be stored and transmitted in **PEM format**.
*   **Signature Format:** All signatures MUST be encoded in **Base64**.
*   **Recommended Library:** Implementations MUST use a well-vetted, standard library that correctly implements ED25519, such as `libsodium` or the native `crypto` module in Node.js v12+.

### **4. P2P Networking Protocol**

#### **4.1. Transport & Stack**

*   **Framework:** The CUE network MUST be implemented using **`libp2p`**.
*   **Transport:** The primary transport is **TCP**. Browser-based nodes MAY use WebSockets or WebRTC.
*   **Stream Multiplexer:** MUST use **`mplex`**.
*   **Connection Encryption:** MUST use **`noise`**.

#### **4.2. Peer & Service Discovery**

*   **Mechanism:** Peer discovery is handled by the **`libp2p` Kademlia DHT**.
*   **Bootstrap:** A network requires at least one **Bootstrap Node** with a stable, publicly known multiaddress. New peers MUST connect to a bootstrap node to join the DHT.

#### **4.3. Event Propagation Protocol: `Gossipsub`**

*   **Mechanism:** All `SignedMessage` events are propagated throughout the network using the **`libp2p-gossipsub`** protocol. Direct RPC is not used for standard event propagation.
*   **Topic:** All peers MUST subscribe to the Gossipsub topic: `/cue/events/1.0.0`.
*   **Propagation Flow:**
    1.  A peer originates a new `ExternalSignal` and wraps it in a `SignedMessage`.
    2.  The peer runs this message through its *own* `onTick` function for local validation.
    3.  If local validation succeeds, the peer **publishes the original `SignedMessage`** to the `/cue/events/1.0.0` topic.
    4.  All other peers subscribed to the topic will receive this message.
    5.  Upon receiving a message from the topic, each peer MUST independently run it through their own `onTick` function to validate it before updating their local state. This ensures that only axiomatically valid events achieve network-wide consensus.

### **5. The `onTick` Protocol: Formal Algorithm**

The `onTick` function is the core event processor. It MUST be executed atomically.

#### **5.1. Helper Functions**

**Function: `createCanonicalString(obj: any): string`**
*   **Purpose:** To create a deterministic string representation of any object.
*   **Algorithm:**
    1.  The function MUST recursively traverse the object.
    2.  All object keys MUST be sorted alphabetically at every level.
    3.  The final output MUST be a JSON string with no whitespace.
    *Example: `{ "b": 2, "a": 1 }` MUST serialize to `{"a":1,"b":2}`.*

**Function: `createCompositeKey(obj: any): number`**
*   **Purpose:** To generate a deterministic integer from any object for modulus checks.
*   **Algorithm:**
    1.  Generate a canonical string of `obj` using `createCanonicalString(obj)`.
    2.  Compute a **CRC32** hash of the canonical string's UTF-8 bytes.
    3.  Return the resulting 32-bit unsigned integer.

#### **5.2. `onTick` Function**

*   **Function:** `onTick(currentState: ComponentState, signedSignal: SignedMessage)`
*   **Algorithm:**

    **Step 1: Identity Axiom (Signature Verification)**
    1.  Deserialize the `signedSignal.payload` bytes into an `ExternalSignal` object (`signal`).
    2.  Verify the `signedSignal.signature` against the original `signedSignal.payload` bytes and the `signedSignal.source_credential_id` using the ED25519 algorithm.
    3.  If verification fails, **TERMINATE**.

    **Step 2: Internal Coherence Check (Rectification)**
    4.  Let `magnitude = currentState.internal_magnitude`.
    5.  If `magnitude % 5 !== 0` OR `magnitude % 7 !== 0`, **TERMINATE**. This check is bypassed for `rectify_state` events.

    **Step 3: Duality Law (Modulus 2)**
    6.  Let `actionKey = createCompositeKey(signal)`.
    7.  Rule: Creation events (`mint_token`) MUST have an odd `actionKey`. Modification/process events (`transfer_token`, `rectify_state`) MUST have an even `actionKey`.
    8.  If the rule is violated, **TERMINATE**.

    **Step 4: Conservation Law (Constant `168`)**
    9.  Let `conservationKey = createCompositeKey(currentState) + createCompositeKey(signal)`.
    10.  If `conservationKey % 168 !== 0`, **TERMINATE**.

    **Step 5: Poly-Axiomatic Consensus Check**
    11.  Look up the required modulus based on `signal.level` (see Appendix A).
    12.  Let `consensusKey = createCompositeKey(signal.payload)`.
    13.  If `consensusKey % requiredModulus !== 0`, **TERMINATE**.

    **Step 6: State Transition Logic**
    14.  The event is now fully validated. Apply the state change based on `signal.payload`.
    15.  **For `mint_token`:**
        *   The peer MUST verify that the `token_id` does not already exist in its `currentState.context`. If it does, **TERMINATE**.
        *   The peer MUST add a new entry to `currentState.context`, where the key is the `token_id` and the value is the serialized `TokenState` message.
        *   The peer MUST increment its `currentState.internal_magnitude` by 1.
    16.  **For `transfer_token`:**
        *   The peer MUST verify that the `token_id` exists in its `currentState.context`. If not, **TERMINATE**.
        *   The peer MUST verify that the `owner_credential_id` of the existing token matches the `signedSignal.source_credential_id`. If not, **TERMINATE**.
        *   The peer MUST update the `owner_credential_id` of the token in its `context` to the `recipient_credential_id`.
        *   The peer MUST increment its `currentState.internal_magnitude` by 1.
    17.  **For `rectify_state`:**
        *   The peer MUST set its `currentState.internal_magnitude` to a base harmonic value (e.g., `35`).

    **Step 7: Finalization**
    18.  Update `currentState.position` (e.g., increment `dimension`).
    19.  Atomically save the `newState` to persistent storage.
    20.  If the event was originated by this peer, it should now be published to the Gossipsub topic.

#### **5.3. `internalMagnitude` Formal Definition**

*   **Definition:** `internalMagnitude` is a quantifiable measure of a peer's cumulative state complexity, or "computational debt." It represents the number of successful write operations the peer has committed to its local state.
*   **Initial Value:** A new peer starts with a harmonically balanced `internalMagnitude` of `35`.
*   **Update Rule:** For every successful event that results in a write to the `context` map (`mint_token`, `transfer_token`), the `internalMagnitude` MUST be incremented by **1**.
*   **Rectification Process:** A peer can reduce its `internalMagnitude` by originating a `rectify_state` event with `level: 'LOCAL'`. This is a privileged, internal action. When a peer processes its own valid `rectify_state` event, it resets its `internalMagnitude` to the base value of `35`. This process allows a peer to "pay down" its computational debt and remain coherent, enabling it to continue performing actions on the network.

### **6. Implementation Guide**

1.  **Dependencies:** Install libraries for `libp2p`, `protobuf-js`, and a standard ED25519 implementation.
2.  **Data Structures:** Generate language-specific classes from the `cue.proto` file.
3.  **Peer Class:** Implement the `Peer` class, `ComponentState`, and state persistence.
4.  **Networking:** Initialize `libp2p` with the full stack. Implement the `Gossipsub` subscription and publish logic.
5.  **`onTick` Implementation:** Code the `onTick` function, ensuring it follows the formal algorithm precisely, including the helper functions for deterministic key generation.
6.  **Node Entry Points:** Create separate executables for running Bootstrap and Client nodes to test interoperability and network consensus.

---

### **Appendix A: Consensus Level Reference**

| ConsensusLevel | Modulus Constant | Purpose |
| :--- | :--- | :--- |
| **`LOCAL`** | `3` | Internal state management, such as rectification. |
| **`PEER_TO_PEER`** | `2` | Simple, direct interactions. |
| **`GROUP`** | `7` | Actions affecting a limited set of peers. |
| **`GLOBAL`** | `24` | Foundational state changes affecting the entire network. |
