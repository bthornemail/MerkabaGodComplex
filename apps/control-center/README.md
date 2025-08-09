# CUE Control Center

Real-time web UI for monitoring, testing, and configuring the CUE (Computational Universe Engine) framework and protocol harmonization.

## Features

### 🎛️ **Real-Time Dashboard**
- System metrics monitoring (CPU, memory, network)
- Live CUE framework status
- Active node tracking
- Performance visualization

### 📚 **Manuscript Generation Monitor**
- Real-time progress tracking
- Chapter-by-chapter quality metrics
- Vec7 validation status
- Coherence scoring and analysis
- Project management interface

### ⚡ **Vec7 Harmony Control**
- Seven-phase prime validation monitoring
- Harmonic threshold configuration
- Real-time harmony state visualization
- Automatic harmonization cycles

### 🧪 **Autonomous Testing Suite**
- Integrated test runner for all CUE packages
- Real-time test execution monitoring
- Coverage reporting
- Cross-package integration testing

### ⚙️ **Protocol Configuration**
- CUE framework parameter tuning
- Vec7 harmony settings
- MDU (Modulo-Divisive Unfolding) configuration
- Manuscript generation parameters
- Axiom system selection

### 📊 **Live Visualization** (Planned)
- Protocol flow diagrams
- MDU layer visualization
- Vec7 harmony cycles
- Network topology mapping

## Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **TanStack Query** for state management
- **WebSocket** real-time communication
- **Lucide React** for icons

### Backend
- **Node.js + Express** API server
- **WebSocket Server** for real-time updates
- **Process Management** for CUE package integration
- **Cross-package Communication** with other ULP packages

### Integration
- **CUE-AMGF System** - Manuscript generation monitoring
- **CUE Dashboard** - System metrics integration  
- **CUE Rectified Prototype** - Protocol testing
- **Real-time Communication** via WebSocket

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm workspace environment
- Other ULP packages installed

### Development

```bash
# Install dependencies (from workspace root)
pnpm install

# Start the control center in development mode
cd packages/cue-control-center
pnpm run start
```

This starts both the backend server (port 3002) and frontend dev server (port 3001) concurrently.

### Production Build

```bash
# Build frontend
pnpm run build

# Build and start backend
pnpm run server:build
pnpm run server:start
```

## Usage

### 1. **System Overview**
Monitor overall system health, view active CUE nodes, and track manuscript generation projects.

### 2. **Manuscript Generation**
- Create new manuscript projects
- Monitor real-time generation progress
- View chapter-by-chapter quality metrics
- Configure generation parameters

### 3. **Vec7 Harmony**
- Start/stop harmonization processes
- Monitor seven-phase validation progress
- Configure harmony thresholds
- View circular prime validation status

### 4. **Testing & Validation**
- Run comprehensive test suites
- Monitor real-time test execution
- View coverage reports
- Validate cross-package integration

### 5. **Configuration Management**
- Adjust CUE framework parameters
- Configure Vec7 harmony settings
- Set manuscript generation preferences
- Select active axiom systems

## WebSocket API

The control center communicates with backend services via WebSocket:

### Client → Server Messages
```typescript
// Start manuscript generation
{ type: 'start_manuscript', payload: { config } }

// Run test suite  
{ type: 'run_test_suite', payload: { suiteId } }

// Start Vec7 harmonization
{ type: 'start_vec7_harmony', payload: { config } }

// Update configuration
{ type: 'update_protocol_config', payload: { config } }
```

### Server → Client Messages
```typescript
// System metrics update
{ type: 'system_metrics', payload: SystemMetrics }

// Manuscript progress update
{ type: 'manuscript_progress', payload: ProgressData }

// Vec7 harmony state update  
{ type: 'vec7_harmony', payload: HarmonyState }

// Test results update
{ type: 'test_results', payload: TestResults }
```

## Integration with CUE Packages

### CUE-AMGF System
- Monitors manuscript generation processes
- Tracks training progress
- Displays quality metrics
- Controls generation parameters

### CUE Dashboard  
- Inherits system monitoring capabilities
- Shares sensor/actuator integration
- Provides franchise management interface

### CUE Rectified Prototype
- Runs integration tests
- Monitors protocol performance
- Validates consensus mechanisms

## Configuration

### Environment Variables
```bash
PORT=3002              # Backend server port
WS_PORT=8080          # WebSocket server port  
NODE_ENV=development   # Environment mode
```

### Protocol Configuration
All CUE framework parameters can be adjusted through the web interface:

- **Validation thresholds**
- **Consensus levels**  
- **Harmonic parameters**
- **Manuscript quality targets**
- **Testing preferences**

## Monitoring Capabilities

### Real-Time Metrics
- System resource usage
- CUE node activity
- Network throughput
- Process execution status

### Quality Tracking
- Manuscript coherence scores
- Vec7 validation rates
- Test coverage percentages
- Harmony achievement rates

### Performance Analysis
- Generation time tracking
- Iteration count monitoring  
- Resource utilization trends
- Error rate analysis

## Development

### Adding New Features
1. Create React components in `src/components/`
2. Add WebSocket message types in `src/types/`
3. Implement server handlers in `server/index.ts`
4. Update the dashboard navigation

### Testing
```bash
# Run frontend tests
pnpm run test

# Run with UI
pnpm run test:ui
```

### Building
```bash
# Frontend build
pnpm run build

# Server build  
pnpm run server:build
```

## Future Enhancements

- **D3.js Visualizations** - Interactive protocol diagrams
- **Real-time Alerts** - Configurable monitoring alerts
- **Historical Analytics** - Long-term performance trends
- **Multi-node Management** - Distributed system control
- **Plugin Architecture** - Extensible monitoring modules

## Contributing

This control center serves as the central monitoring hub for the entire Universal Life Protocol ecosystem. When adding features:

1. Maintain real-time responsiveness
2. Follow the established design system
3. Integrate with existing WebSocket architecture
4. Add comprehensive error handling
5. Document new configuration options

The control center enables you to watch, configure, and optimize the autonomous CUE framework training and manuscript generation processes in real-time.