# CUE Dashboard - Real-time CUE Network Interface

A React-based dashboard that provides real-time monitoring and control of the CUE (Computational Universe Engine) network with integrated sensor-actuator agent management.

## Features

- **Real-time CUE Network Connection**: WebSocket bridge to CUE peer network
- **Live Sensor Readings**: Monitor temperature and environmental data from CUE agents
- **Agent Control**: View and control autonomous sensor-actuator agents
- **Franchise Management**: Display franchise data validated through CUE consensus
- **Event Stream**: Live feed of CUE network events with cryptographic validation
- **Manual Override**: Send HVAC commands directly through CUE network

## Architecture

### CUE Integration
- **WebSocket Bridge**: Connects React frontend to CUE network via Node.js bridge
- **Event-Driven Updates**: Real-time data updates from CUE events
- **Cryptographic Validation**: All data verified through CUE's consensus mechanism
- **Agent Communication**: Direct interface with cue-sensor-actuator agents

### Components
- **CueClient**: Service for WebSocket communication with CUE network
- **useCueData**: React hook for CUE data integration with automatic reconnection
- **SensorReadings**: Live sensor data visualization from IoT devices
- **AgentControl**: Interface for monitoring and controlling autonomous agents
- **FranchiseInfo**: Business data display with CUE validation

## Quick Start

### Prerequisites
- Node.js (v18+)
- Running CUE rectified prototype network
- WebSocket bridge server

### Installation

```bash
# Install dependencies
npm install

# Build the React application
npm run build

# Start the WebSocket bridge and serve the dashboard
npm run start:dashboard
```

### Development Mode

```bash
# Start React development server
npm run dev

# In another terminal, start the bridge server
node src/cue-dashboard-node.js
```

The dashboard will be available at `http://localhost:5173` (dev) or `http://localhost:8080` (production).

## Integration with CUE Rectified Prototype

### 1. Start CUE Network

First, ensure your CUE rectified prototype is running:

```bash
cd ../cue-rectified-prototype
npm run demo
```

### 2. Start Dashboard Bridge

```bash
npm run start:dashboard
```

### 3. Connect to Network

The dashboard automatically connects to the CUE network via WebSocket bridge and begins displaying real-time data.

## CUE Event Types

The dashboard handles these CUE events:

- **SENSOR_READING**: Temperature and environmental data
- **HVAC_COMMAND**: Actuator control commands  
- **SET_AGENT_POLICY**: Autonomous agent configuration
- **FRANCHISE_DATA_UPDATE**: Business data changes
- **MINT_TOKEN**: Token economy events
- **COMPUTE_REQUEST**: Distributed computation jobs
- **RECTIFICATION_PROOF**: Consensus validation events

## Configuration

### WebSocket Configuration

Modify the CUE client configuration in `src/App.jsx`:

```javascript
const cueConfig = {
  wsUrl: 'ws://localhost:8080',
  franchiseId: 'myFranchiseLA',
  autoConnect: true,
  sensorDeviceIds: ['SENSOR_LIVING_ROOM', 'DHT11_001']
};
```

### Bridge Server Configuration

Configure the bridge server in `src/cue-dashboard-node.js`:

```javascript
const bridge = new CueDashboardBridge();
bridge.start(8080); // WebSocket port
```

## Agent Integration

### Sensor Data Flow

1. **IoT Sensors** → **CUE Agent** → **CUE Network** → **Dashboard**
2. Temperature readings are validated through CUE's harmonic consensus
3. Dashboard displays real-time sensor data with agent source attribution

### Control Flow

1. **Dashboard** → **WebSocket Bridge** → **CUE Network** → **Agent** → **HVAC Device**
2. Manual commands override autonomous agent decisions
3. All commands are cryptographically signed and validated

### Agent Status

The dashboard shows:
- **Agent Policies**: Temperature thresholds and device mappings
- **Current Status**: Real-time temperature vs target
- **Command History**: Recent HVAC commands with timestamps
- **Manual Override**: Direct control buttons for HEAT/COOL/OFF

## Development

### Project Structure

```
packages/cue-dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── CueStatus.jsx   # Network connection status
│   │   ├── SensorReadings.jsx # Live sensor data
│   │   ├── AgentControl.jsx   # Agent management
│   │   └── FranchiseInfo.jsx  # Business data
│   ├── hooks/
│   │   └── useCueData.js   # CUE integration hook
│   ├── services/
│   │   └── CueClient.js    # WebSocket CUE client
│   ├── cue-dashboard-node.js # Bridge server
│   ├── App.jsx             # Main application
│   └── main.jsx            # React entry point
├── package.json
└── README.md
```

### Adding New Event Types

1. **Update CueClient.js**: Add event handler in `handleCueEvent()`
2. **Update useCueData.js**: Add state management for new event type
3. **Create Component**: Add React component to display/interact with data
4. **Update App.jsx**: Integrate new component into dashboard

### Styling

The dashboard uses CSS custom properties for theming:

```css
:root {
  --cue-primary: #fca11a;    /* CUE orange */
  --cue-secondary: #35a745;   /* Success green */
  --cue-accent: #17a2b8;      /* Info blue */
  --cue-danger: #dc3545;      /* Error red */
  --cue-dark: #2f2f2f;        /* Card background */
  --cue-darker: #1a1a1a;      /* Page background */
}
```

## Testing with CUE Agents

### 1. Mock Data Mode (Default)

The dashboard includes mock sensor data and agent simulation for testing without a full CUE network.

### 2. Live CUE Integration

Connect to running CUE rectified prototype:

```bash
# Terminal 1: Start CUE bootstrap
cd ../cue-rectified-prototype
npm run start:bootstrap

# Terminal 2: Start CUE agent
npm run start:agent

# Terminal 3: Start dashboard
cd ../cue-dashboard
npm run start:dashboard
```

### 3. Custom Agent Testing

Create custom agents by extending the thermostat example:

```assemblyscript
// Custom agent logic in AssemblyScript
export function customDecisionLogic(
  sensorValue: f32,
  threshold: f32,
  customParameter: f32
): i32 {
  // Implement custom autonomous behavior
  return sensorValue > threshold ? 1 : 0;
}
```

## Troubleshooting

### Connection Issues

- Verify CUE rectified prototype is running
- Check WebSocket bridge server is started
- Ensure ports 8080 (bridge) and 5173 (dev) are available

### Missing Sensor Data

- Confirm CUE agents are broadcasting SENSOR_READING events
- Check agent policy configuration matches dashboard sensor IDs
- Verify WebSocket connection status in dashboard

### Agent Control Issues

- Ensure agents have HVAC device IDs configured
- Check that HVAC commands are reaching CUE network
- Verify agent WASM logic is processing commands correctly

## Production Deployment

### Environment Configuration

```bash
# Set production WebSocket URL
VITE_CUE_WS_URL=wss://your-cue-network.com:8080

# Build for production
npm run build

# Start production server
npm run start:dashboard
```

### Security Considerations

- Enable WSS (WebSocket Secure) for production
- Implement authentication for dashboard access
- Validate all CUE events cryptographically
- Rate limit WebSocket connections

### Monitoring

- Monitor WebSocket connection stability
- Track CUE event processing latency
- Log agent command success/failure rates
- Monitor sensor data freshness

---

This dashboard provides a comprehensive interface to the CUE network, enabling real-time monitoring and control of autonomous sensor-actuator agents with full cryptographic validation through the Computational Universe Engine framework.