# CUE Rectified Prototype - Project Setup Instructions

This document provides comprehensive setup instructions for the CUE (Computational Universe Engine) Rectified Prototype, including the new `cue-sensor-actuator` agent integration.

## Overview

The CUE Rectified Prototype demonstrates a complete implementation of:

- **Computational Universe Engine (CUE)**: Meta-mathematical framework for AGI
- **Universal Binary Hypergraph Protocol (UBHP)**: Canonical data transformation
- **Continuous Axiomatic Rectification (CAR)**: Emergent consensus mechanism
- **Autonomous Sensor-Actuator Agents**: Physical world integration via WASM

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TypeScript
- AssemblyScript compiler

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Build TypeScript and AssemblyScript components
npm run build
```

### 2. Integrated Demo

For a complete demonstration of all CUE features:

```bash
npm run demo
```

This runs an integrated simulation showing:
- Peer network formation with cryptographic identity
- Axiomatic consensus validation
- Token economy and compute jobs
- Autonomous thermostat agent decisions
- Continuous rectification proofs

### 3. Individual Node Operation

For advanced users wanting to run individual components:

```bash
# Start bootstrap node (Terminal 1)
npm run start:bootstrap

# Start compute provider (Terminal 2)
npm run start:provider

# Start user client (Terminal 3)
npm run start:client

# Start thermostat agent (Terminal 4)
npm run start:agent
```

**Note**: Update bootstrap addresses in the node files before running individually.

## Architecture Components

### Core Framework
- **SimplePeer** (`src/core/simple-peer.ts`): P2P networking with cryptographic validation
- **Axioms** (`src/common/axioms.ts`): Multi-prime harmonic validation system
- **UBHP Types** (`src/common/ubhp_types.ts`): Canonical S-expression encoding
- **Harmonic Geometry** (`src/common/harmonic_geometry.ts`): Geometric consensus calculations

### Agent Integration
- **Agent Node** (`src/nodes/agent-thermostat-node.ts`): Autonomous sensor-actuator peer
- **WASM Logic** (`assembly/agent_thermostat.ts`): Decision engine in AssemblyScript
- **Sandbox** (`src/common/sandbox.ts`): Secure WASM execution environment

### Event Types
- `SENSOR_READING`: Temperature and environmental data
- `HVAC_COMMAND`: Actuator control commands
- `SET_AGENT_POLICY`: Autonomous behavior configuration
- `RECTIFICATION_PROOF`: CAR consensus validation
- `COMPUTE_REQUEST`: Distributed computation jobs
- `MINT_TOKEN`: Economy token creation

## CUE-Sensor-Actuator Agent

The `cue-sensor-actuator` agent provides a bridge between the digital CUE network and physical IoT devices:

### Physical Adaptation Layers
1. **Sensor Integration**: Reads environmental data (temperature, humidity, etc.)
2. **WASM Decision Logic**: Processes readings against policy thresholds
3. **Actuator Commands**: Controls physical devices (HVAC, lights, etc.)
4. **Network Validation**: All actions cryptographically verified

### Agent Configuration
```typescript
const policy: ThermostatPolicyPayload = {
  agentId: agent.credentialId,
  desiredTemperature: 22.0,
  tolerance: 0.5,
  hvacDeviceId: 'HVAC_001',
  sensorDeviceId: 'SENSOR_LIVING_ROOM'
};
```

### WASM Decision Function
```assemblyscript
export function decideHVACAction(
  currentTemp: f32,
  desiredTemp: f32,
  tolerance: f32
): i32 {
  // Returns: 1=HEAT, 2=COOL, 0=OFF
}
```

## Consensus Mechanisms

### Poly-Axiomatic Validation
- **LOCAL**: Prime base 3 validation
- **PEER_TO_PEER**: Primes 3, 5 validation  
- **GROUP**: Primes 3, 5, 7 validation
- **GLOBAL**: Primes 3, 5, 7, 11 validation

### Rectification Law
State transitions must satisfy: `delta % 24 === 0`

### Vec7HarmonyUnit Structure
All events converted to 7-dimensional validation structures mapped to Fano Plane geometry.

## Security Features

- **ED25519 Cryptography**: All events cryptographically signed
- **WASM Sandboxing**: Untrusted code execution isolation
- **Gas Metering**: Resource usage limits
- **Proof Expiration**: Time-bounded consensus proofs
- **Reputation System**: Provider trust scoring

## Testing

```bash
# Run conceptual test framework
npm test

# Interactive component testing
node interactive-test.js
```

## Integration Examples

### IoT Device Integration
```typescript
// Example: DHT11 temperature sensor
const reading: TemperatureReadingPayload = {
  sensorId: 'DHT11_001',
  timestamp: Date.now(),
  value: 23.5,
  unit: 'Celsius'
};

await agent.broadcast({
  type: 'SENSOR_READING',
  level: 'LOCAL',
  payload: reading,
  timestamp: Date.now()
});
```

### Custom Agent Logic
```assemblyscript
// Custom decision logic in AssemblyScript
export function customAgentLogic(
  sensorData: f32,
  threshold: f32
): i32 {
  // Implement custom autonomous behavior
  return sensorData > threshold ? 1 : 0;
}
```

## Network Configuration

### Bootstrap Node
Acts as network anchor for peer discovery via libp2p DHT.

### Compute Providers
Execute WASM jobs with reputation-based selection.

### Agent Nodes
Autonomous entities with WASM-based decision logic.

### Client Nodes
Request compute jobs and interact with token economy.

## Troubleshooting

### Common Issues
1. **WASM not found**: Run `npm run build` to compile AssemblyScript
2. **Bootstrap connection failed**: Verify multiaddress format
3. **Signature validation failed**: Check cryptographic key consistency
4. **Axiomatic rejection**: Verify data satisfies harmonic constraints

### Debug Mode
Set environment variable for verbose logging:
```bash
DEBUG=cue:* npm run demo
```

## Advanced Configuration

### Custom Consensus Levels
Extend `ConsensusLevel` types for domain-specific validation.

### Agent WASM Templates
Create custom AssemblyScript agents for different IoT scenarios.

### Harmonic Signature Tuning
Modify geometric constants in `harmonic_geometry.ts` for specialized applications.

## Development Workflow

1. **Modify Agent Logic**: Edit AssemblyScript files in `assembly/`
2. **Rebuild**: Run `npm run build` to compile changes
3. **Test**: Use `npm run demo` or individual node testing
4. **Deploy**: Configure production bootstrap nodes and networking

## Production Deployment

### Requirements
- Persistent storage for peer state
- Network connectivity for P2P communication
- Hardware access for IoT sensor/actuator integration
- Monitoring for consensus validation metrics

### Scaling Considerations
- Bootstrap node redundancy
- Compute provider load balancing
- Agent policy distribution
- Token economy liquidity management

---

This prototype demonstrates the complete CUE framework with autonomous agent capabilities, providing a foundation for building verifiable, self-organizing digital-physical systems.