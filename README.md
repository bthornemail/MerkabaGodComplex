# Reality Compiler - Interactive Multiverse

A React TypeScript application for creating and visualizing computational systems with pure functions in a 3D multiverse environment. Build systems that process data through functional pipelines and watch them interact in real-time 3D space.

![Reality Compiler Demo](https://img.shields.io/badge/Status-Active-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![React](https://img.shields.io/badge/React-19.1-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.179-red)

## 🌟 Features

### Pure Function Computing
- **Mathematical Operations**: Add, multiply, divide, sqrt, trigonometric functions
- **Array Processing**: Map, filter, reduce, sum, mean operations
- **Function Composition**: Chain operations together seamlessly
- **Computation History**: Track all inputs and outputs with timestamps
- **Immutable Processing**: All functions are pure with no side effects

### Interactive 3D Visualization
- **Real-time 3D Rendering**: Systems appear as tetrahedrons in 3D space
- **Physics Simulation**: Systems attract/repel based on computational similarity
- **Visual Selection**: Click to select, Shift+Click to build execution sequences
- **Orbital Controls**: Full 3D navigation with mouse/trackpad

### Data Management
- **Batch Data Injection**: Process arrays of data through text area input
- **Result Persistence**: All computation results are preserved
- **System Inspection**: Detailed view of system state and history
- **JSON-based**: All data in human-readable JSON format

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000` (or next available port).

### Building for Production

```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

## 📖 Usage Guide

### 1. Creating Computational Systems

1. **Select Functions**: Choose from available pure functions in the left sidebar
2. **Set Initial Data**: Provide JSON input data (e.g., `{"value": 10}`)
3. **Click "Add Custom System"**: System appears as a 3D tetrahedron

### 2. Data Injection

Once systems exist:

1. **Select Target System**: Choose from dropdown in "Data Injection" panel
2. **Input Data Array**: One JSON object per line:
   ```json
   {"value": 1}
   {"value": 2}
   {"value": 3}
   {"array": [1, 2, 3, 4, 5]}
   ```
3. **Click "Inject Data Array"**: System processes each item sequentially

### 3. System Interaction

- **Click System**: Select and inspect properties
- **Shift+Click**: Add to execution sequence
- **Run Sequence**: Process selected systems in order
- **View Results**: Right sidebar shows detailed system information

## 🧮 Available Pure Functions

### Basic Arithmetic
- `initWithValue` - Initialize with numeric value
- `doubleValue` - Multiply value by 2
- `halveValue` - Divide value by 2

### Advanced Math
- `pureMath` - Composite: add(x, multiply(x, 2))
- `pureCompose` - Chain: sqrt(add(multiply(x, 3), 10))
- `oscillate` - Generate sine wave values

### Array Operations
- `pureFilter` - Filter arrays with predicates
- `pureReduce` - Reduce arrays to single values

### State Management
- `initWithEnergy` - Initialize energy systems
- `decayEnergy` - Apply energy decay (90%)
- `setStateGrown/Decayed` - Set system states

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── ThreeVisualization.tsx    # 3D rendering and interaction
│   ├── SystemCreator.tsx         # Function selection and data input
│   ├── SystemInspector.tsx       # System details and history
│   └── ControlPanel.tsx          # Sequence execution controls
├── hooks/
│   └── useSimulation.ts          # Main simulation state management
├── utils/
│   ├── pureFunctions.ts          # Pure function library
│   └── computationalSystem.ts    # System logic and encoding
├── types/
│   └── index.ts                  # TypeScript type definitions
└── App.tsx                       # Main application component
```

### Key Technologies
- **React 19**: Modern React with hooks and concurrent features
- **TypeScript 5.9**: Full type safety and developer experience
- **Three.js**: 3D graphics and physics simulation
- **Vite**: Fast development server and building
- **Tailwind CSS**: Utility-first styling

## 🔧 Configuration

### Development Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start Express server (legacy)

### Environment Variables
No environment variables required for basic operation.

## 🧪 Example Use Cases

### 1. Mathematical Sequence Processing
```json
{"value": 1}
{"value": 2}
{"value": 4}
{"value": 8}
```
Use with `doubleValue` to see exponential growth.

### 2. Array Data Analysis
```json
{"array": [1, 2, 3, 4, 5]}
{"array": [10, 20, 30]}
{"array": [100, 200]}
```
Use with `pureReduce` to sum arrays.

### 3. Energy System Simulation
```json
{"energy": 100}
{"energy": 90}
{"energy": 81}
```
Use with `decayEnergy` to model decay systems.

## 🔬 Technical Details

### Pure Function Engine
The `PureFunctionEngine` class provides:
- Function registration and management
- Computation history tracking
- Operation chaining capabilities
- Type-safe execution

### Physics Simulation
- Systems attract/repel based on execution trace similarity
- CQE (Computational Quantum Entanglement) algorithm for similarity measurement
- Real-time position updates with momentum and damping

### Data Flow
1. User selects functions and provides data
2. `RecursiveEncoder` executes function pipeline
3. Results stored in system's `resultHistory`
4. 3D visualization updates based on system state
5. Physics engine updates system positions

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📜 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Large datasets may cause performance issues
- Physics simulation can become unstable with many systems
- WebGL context may be lost on some mobile devices

## 🗺️ Roadmap

- [ ] WebWorker support for heavy computations
- [ ] Save/load system configurations
- [ ] Custom function definition UI
- [ ] Performance optimizations for large datasets
- [ ] VR/AR visualization support

## 📞 Support

For questions or issues:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include browser/OS information for bugs

---

Built with ❤️ using React, TypeScript, and Three.js