# CUE Rectified Prototype - Testing Guide

This guide provides comprehensive instructions for testing all aspects of the CUE system.

## 🚀 Quick Start Testing

### 1. Basic Demo (Recommended First Test)
```bash
npm run demo
```
This runs a complete simulation showing all major features working together.

### 2. Component Testing
```bash
npm run test-components
```
Tests individual components: crypto, harmonic vectors, peer creation, etc.

### 3. Interactive Testing
```bash
npm run interactive
```
Opens an interactive shell where you can:
- Create peers manually
- Connect them
- Send different event types
- Run custom scenarios

## 🔍 What Each Test Shows

### Demo Test Results
When you run `npm run demo`, look for:

**✅ SUCCESS Indicators:**
- `Peer online with X connections` - Network formation
- `Processing valid event` - Consensus validation working
- `[HarmonyProcessor] Transition at level 'LOCAL' is valid` - Axiomatic validation
- `Sensor Reading: X°Celsius` - Agent processing

**❌ EXPECTED Rejections:**
- `Event 'MINT_TOKEN' REJECTED due to axiomatic violation` - This is correct! The system is designed to reject events that don't meet strict mathematical requirements.

### Component Test Results
The component test verifies:
- ✅ Cryptographic operations (key generation, signing, verification)
- ✅ Harmonic vector generation from data
- ✅ S-expression canonical encoding
- ✅ Peer identity creation
- ✅ Mathematical prime divisibility checks

### Interactive Testing Commands
```bash
CUE> help                    # Show all commands
CUE> demo-scenario          # Quick automated test
CUE> create-peer alice      # Create a named peer
CUE> create-peer bob        # Create another peer  
CUE> list-peers             # See all peers
CUE> connect-peers          # Connect all peers
CUE> send-event SENSOR_READING  # Send a temperature reading
CUE> exit                   # Close interactive mode
```

## 🧪 Advanced Testing Scenarios

### Testing Different Event Types
```bash
# In interactive mode:
CUE> send-event SENSOR_READING    # Usually PASSES (LOCAL level)
CUE> send-event MINT_TOKEN        # Usually REJECTED (GLOBAL level)
CUE> send-event COMPUTE_REQUEST   # Usually REJECTED (GROUP level)
CUE> send-event HVAC_COMMAND      # Usually PASSES (PEER_TO_PEER level)
```

### Testing Consensus Levels
The system has different validation rigor:
- **LOCAL**: Requires divisibility by prime 3 only
- **PEER_TO_PEER**: Requires divisibility by primes 3, 5
- **GROUP**: Requires divisibility by primes 3, 5, 7  
- **GLOBAL**: Requires divisibility by primes 3, 5, 7, 11

### Manual Network Testing
```bash
# Terminal 1
npm run start:bootstrap

# Terminal 2  
npm run start:provider

# Terminal 3
npm run start:client

# Terminal 4
npm run start:agent
```

## 📊 Understanding Test Output

### Color-Coded Messages
- 🔵 **Blue**: Network operations (broadcasting, connections)
- 🟢 **Green**: Successful operations (validation passed, jobs completed)
- 🟡 **Yellow**: Information (peer advertising, policy updates)
- 🔴 **Red**: Rejections or errors (this is often expected!)
- 🟣 **Magenta**: Event processing
- 🔶 **Cyan**: Sensor readings and data

### Key Log Messages to Watch For

**Network Formation:**
```
[ PUBLI] Peer starting...
[ PUBLI] Connected to peer PUBLI
[ PUBLI] Peer online with 1 connections
```

**Cryptographic Validation:**
```
[ PUBLI] Processing valid event 'SENSOR_READING' from PUBLI
```

**Axiomatic Consensus:**
```
[HarmonyProcessor] Transition at level 'LOCAL' is valid against primes: [3].
[Axiom] Check failed for phase 0 against prime base 5.
```

**Agent Decision Making:**
```
[ PUBLI] Agent decided to send HVAC command: COOL
[ PUBLI] Agent decided no HVAC action needed.
```

## 🔧 Troubleshooting

### Common Issues

1. **All events rejected**: This is often expected! The system is designed with strict mathematical validation.

2. **No peer connections**: Make sure you're running the bootstrap node first.

3. **Crypto errors**: The system uses RSA keys - if you see crypto errors, try deleting the `*.json` state files.

4. **Build errors**: Run `npm run build` first before any testing.

### State Files
The system creates JSON files to persist peer states:
- `demo-*.json` - Demo peer states
- `test-*.json` - Test peer states  
- `peer-state-*.json` - Individual node states

You can delete these files to reset peer identities.

## 🎯 Expected Behavior

This is a **theoretical research prototype**, not a production system. Expected behavior:

✅ **Working Features:**
- Peer network formation
- Cryptographic signing/verification
- Harmonic vector generation
- Axiomatic validation (rejecting invalid events)
- LOCAL-level events processing
- Agent decision logic
- Mathematical consensus mechanisms

❌ **Intentionally Limited:**
- Many events are rejected by design (demonstrates strict consensus)
- Simplified networking (not full libp2p)
- Mock WASM execution (not real WebAssembly)
- Single-process simulation

## 📈 Performance Notes

The system intentionally includes computationally expensive operations:
- RSA cryptographic operations
- SHA-256 hashing for consensus proofs
- Prime modulus calculations
- Harmonic vector mathematics

This demonstrates the theoretical framework's approach to ensuring security through computational work.

## 🎉 Success Criteria

Your tests are successful if you see:
1. Peers connecting to each other
2. Events being signed and verified
3. Some events passing validation (LOCAL level)
4. Some events being rejected (GLOBAL/GROUP levels)
5. Agent responses to sensor data
6. Mathematical consensus calculations

The system working "correctly" means it's being appropriately selective about which events it accepts!