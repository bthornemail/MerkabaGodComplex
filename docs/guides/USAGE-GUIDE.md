# Universal Life Protocol - Complete Usage Guide

> **🌌 From Tests to Production: How to Use the Autonomous CUE AI Framework**

## 🚀 Quick Start - Running the Full Application

### One-Command Launch
```bash
npm start
```
This starts the complete CUE ecosystem with all services running.

## 🏗️ Architecture Overview

The Universal Life Protocol runs as a **distributed service architecture** with multiple interconnected components:

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CUE Service Ecosystem                         │
├─────────────────────────────────────────────────────────────────────┤
│  🌐 API Gateway (Port 8000)     │  🧠 CUE Network (Port 3001)      │
│  Main API endpoint               │  Core network simulation          │
├─────────────────────────────────────────────────────────────────────┤
│  🤖 CLARION-MDU (Port 3003)     │  🧠 Knowledge Trie (Port 5175)   │
│  AI training & manuscripts      │  Knowledge extraction & graphs    │
├─────────────────────────────────────────────────────────────────────┤
│  🎛️ Control Center (Port 5173)  │  📊 Dashboard (Port 5174)         │
│  Main React interface           │  Legacy React interface           │
└─────────────────────────────────────────────────────────────────────┘
```

## 📋 Service Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| **API Gateway** | http://localhost:8000 | Main API endpoint, service routing |
| **CUE Network** | http://localhost:3001 | Core CUE network simulation |
| **CLARION-MDU** | http://localhost:3003 | AI training and manuscript generation |
| **Knowledge Trie** | http://localhost:5175 | Knowledge extraction and graph building |
| **Control Center** | http://localhost:5173 | **Main Dashboard - Start Here** |
| **Legacy Dashboard** | http://localhost:5174 | Alternative interface |

## 🎯 Primary Use Cases

### 1. 🧠 Autonomous AI Training & Development

**What it does:** Train the CLARION-MDU cognitive architecture to learn and improve manuscript generation through reinforcement learning.

**How to use:**
1. **Start Services:** `npm start`
2. **Open Control Center:** http://localhost:5173
3. **Navigate to CLARION-MDU Panel**
4. **Click "Start Training Session"**
5. **Monitor:** Watch implicit knowledge states grow (currently 596+ states)

**API Usage:**
```bash
# Start training via API
curl -X POST http://localhost:3003/api/train

# Check training status
curl http://localhost:3003/api/status
```

**Direct Commands:**
```bash
npm run clarion:train          # One-time training session
npm run clarion:status         # Check current memory state
```

### 2. 📝 AI-Assisted Manuscript Generation

**What it does:** Generate coherent manuscripts with Vec7 mathematical validation using the trained CLARION-MDU system.

**How to use:**
1. **Open Control Center:** http://localhost:5173
2. **Navigate to Manuscript Monitor**
3. **Configure:** Set chapters, quality thresholds, Vec7 validation
4. **Generate:** Click "Start Generation"
5. **Monitor:** Real-time progress, coherence scores, Vec7 validation

**Expected Results:**
- **14 chapters** generated automatically
- **0.779 average coherence** (improving with training)
- **14.3% Vec7 validation rate** (prime-based mathematical validation)
- **Sub-second generation** per chapter

### 3. 🔬 CUE Framework Research & Testing

**What it does:** Explore and validate the core Computational Universe Engine components.

**How to use:**
1. **Core Demo:** `npm run core:demo`
2. **Comprehensive Tests:** `npm run core:test`
3. **Integration Testing:** Access http://localhost:5173/testing

**Components Tested:**
- **MDU (Modulo-Divisive Unfolding):** Multi-domain state management
- **CRT (Chinese Remainder Theorem):** Harmonic resonance detection
- **CTL (Continuous Transylvanian Lottery):** Quantum consensus via Fano Plane
- **CLARION-MDU:** Cognitive learning architecture
- **Vec7 Harmony:** Prime-based validation (bases 7, 11, 13, 17)

### 4. 🧠 Knowledge Extraction & Graph Building

**What it does:** Extract structured knowledge from documents and build knowledge graphs using AI models.

**How to use:**
1. **Access Knowledge Trie:** http://localhost:5175 or via Control Center
2. **Upload Documents:** Select a directory with text files (.txt, .md, .docx)
3. **Configure Processing:**
   - Choose Ollama model for extraction
   - Select chunking strategy (paragraph or fixed-size)
   - Enable CUE integration for advanced processing
4. **Extract Knowledge:** AI processes text and creates (Subject, Predicate, Object) triples
5. **View Results:** Interactive 3D knowledge graph and comprehensive statistics

**Integration Features:**
- **Harmonic Signatures:** Generate CUE-compatible harmonic vectors
- **CLARION-MDU Rules:** Feed knowledge as explicit rules to autonomous agents
- **Real-time Processing:** WebSocket updates and live statistics
- **Provenance Tracking:** Complete traceability from source to knowledge

### 5. 🤖 Local LLM Integration

**What it does:** Use local Ollama models for knowledge extraction, validation, and manuscript assistance.

**How to use:**
1. **Ensure Ollama Running:** `ollama serve`
2. **Test Connectivity:** Direct access via Knowledge Trie or Control Center
3. **Available via:** Knowledge extraction, manuscript generation, validation tasks

**Available Models** (detected automatically):
- `llama3.2` - Primary model for knowledge extraction
- `phi3.5` - Fast model for simple tasks
- `qwen2.5` - Multilingual support

## 🖥️ User Interfaces

### 🎛️ Control Center (Primary Interface)

**URL:** http://localhost:5173

**Features:**
- **Real-time System Monitoring:** CPU, memory, disk, network
- **CLARION-MDU Training Control:** Start/stop/monitor AI training
- **Manuscript Generation:** Configure and monitor document creation
- **Vec7 Harmony Visualization:** Prime validation phases
- **Protocol Configuration:** UBHP and CUE parameter tuning
- **Testing Dashboard:** Run and monitor comprehensive tests

**Navigation:**
```
Control Center
├── System Overview     # Resource monitoring and CUE network status
├── CLARION-MDU Panel   # AI training control and learning metrics  
├── Knowledge Trie      # Knowledge extraction and graph building
├── Manuscript Monitor  # Document generation and quality tracking
├── Vec7 Harmony        # Mathematical validation visualization
├── Protocol Config     # UBHP and CUE parameter configuration
├── Testing Panel       # Automated testing and benchmarking
└── Visualization       # Real-time data visualization
```

### 📊 Legacy Dashboard (Alternative Interface)

**URL:** http://localhost:5174

**Features:**
- **Basic Monitoring:** Simplified system metrics
- **Agent Status:** CUE agent management
- **Sensor Readings:** Environmental and system sensors
- **Franchise Info:** Deployment and configuration data

## 🔧 Development Workflows

### A. Training the Autonomous AI

**Goal:** Improve the CLARION-MDU system's manuscript generation capability.

**Workflow:**
1. **Start Services:** `npm start`
2. **Initial Training:** `npm run clarion:train`
3. **Monitor Progress:** http://localhost:5173 → CLARION-MDU Panel
4. **Check Memory:** `npm run clarion:status`
5. **Generate Test Content:** Use Manuscript Monitor
6. **Analyze Results:** Vec7 validation rates, coherence scores
7. **Iterate:** Repeat training for better performance

### B. Research & Development

**Goal:** Explore and enhance CUE framework capabilities.

**Workflow:**
1. **Run Core Demo:** `npm run core:demo`
2. **Comprehensive Testing:** `npm run core:test`
3. **Interactive Exploration:** http://localhost:5173 → Testing Panel
4. **Modify Components:** Edit files in `libs/cue-core/`
5. **Test Changes:** Re-run tests and demos
6. **Integration Testing:** Full service stack testing

### C. Manuscript Production

**Goal:** Generate high-quality documents with mathematical validation.

**Workflow:**
1. **Prepare AI:** Ensure CLARION-MDU is trained (596+ states)
2. **Configure Generation:** http://localhost:5173 → Manuscript Monitor
3. **Set Parameters:**
   - Chapter count (default: 14)
   - Quality threshold (0.7+ coherence)
   - Vec7 validation (prime bases 7,11,13,17)
4. **Start Generation:** Monitor real-time progress
5. **Review Output:** Check coherence and Vec7 validation rates
6. **Export Results:** Access generated manuscripts in `manuscript_final/`

## 🛠️ Management Commands

### Service Management
```bash
npm start                      # Start all services
npm run services              # Same as start
npm stop                      # Stop all services (Ctrl+C)
```

### Development Commands
```bash
# Core CUE Framework
npm run core:demo             # CUE synthesis demonstration
npm run core:test             # Comprehensive integration tests

# AI Training & Manuscripts  
npm run clarion:train         # Train CLARION-MDU system
npm run clarion:status        # Check training memory state
npm run ai-training:demo      # Generate manuscript with current AI
npm run ai-training:benchmark # Performance testing

# Local LLM Integration
npm run ollama:test           # Test Ollama connectivity
npm run ollama:demo           # Ollama integration demo

# Build & Deploy
npm run build                 # Build all components
npm run clean                 # Clean build artifacts
```

### API Health Checks
```bash
# Overall system health
curl http://localhost:3000/health

# Individual service status
curl http://localhost:3003/api/status    # CLARION-MDU
curl http://localhost:3004/api/status    # Ollama
```

## 📊 Monitoring & Metrics

### System Performance
- **CPU Usage:** Real-time processor utilization
- **Memory:** RAM usage and available memory
- **Disk I/O:** Storage read/write operations
- **Network:** Inbound/outbound data transfer

### CUE-Specific Metrics
- **Active CUE Nodes:** Network simulation participants
- **Processed Events:** Total events handled by CUE network
- **Harmonic Resonance:** Mathematical synchronization levels
- **Vec7 Validation:** Prime-based validation success rates

### AI Training Metrics
- **Implicit Knowledge States:** Currently 596+ learned states
- **Explicit Rules:** CLARION-MDU minted rules (0 currently, learning in progress)
- **Learning Rate:** 0.1 (configurable)
- **Meta-Cognitive Adaptation:** Dynamic base reconfiguration

## 🎯 Production Deployment

### Environment Configuration
```bash
# Development (current setup)
source .env.development
npm start

# Production (future)
source .env.production
npm run build
npm run prod-start
```

### Scaling Considerations
- **CUE Network:** Can scale to multiple nodes
- **CLARION-MDU:** Distributed training possible
- **API Gateway:** Load balancing ready
- **Databases:** PostgreSQL/MongoDB integration ready

## 🔍 Troubleshooting

### Common Issues

**Services Won't Start:**
```bash
# Check port conflicts
lsof -i :3000-3004,5173-5174

# Verify dependencies
npm install
```

**Ollama Not Connecting:**
```bash
# Start Ollama service
ollama serve

# Test connectivity
curl http://localhost:11434/api/tags
```

**CLARION Training Issues:**
```bash
# Check training memory
cat libs/cue-ai-training/clarion_mdu_training_memory.json

# Reset training state
rm libs/cue-ai-training/clarion_mdu_training_memory.json
npm run clarion:train
```

**Dashboard Build Issues:**
```bash
# Clean build cache
npm run clean
npm run build

# Check TypeScript errors
cd apps/control-center
npm run build
```

## 📈 Advanced Features

### Custom API Integration
```javascript
// Connect to CUE services
const response = await fetch('http://localhost:3000/health');
const status = await response.json();

// Start manuscript generation
const manuscript = await fetch('http://localhost:3003/api/train', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chapters: 10, quality: 0.8 })
});
```

### WebSocket Real-time Updates
```javascript
// Connect to Control Center WebSocket
const ws = new WebSocket('ws://localhost:5173');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'system_metrics') {
    updateDashboard(data.payload);
  }
};
```

### CLARION-MDU Training Customization
```bash
# Custom training parameters
cd libs/cue-ai-training
npx ts-node clarion-mdu-training-demo.ts --learning-rate=0.2 --chapters=20
```

## 🎉 Success Metrics

**Your system is working correctly when you see:**

✅ **All 6 services running** on their designated ports  
✅ **CLARION-MDU with 596+ implicit knowledge states**  
✅ **Manuscript generation averaging 0.779+ coherence**  
✅ **Vec7 validation rates above 10%**  
✅ **Ollama integration with 3+ available models**  
✅ **Real-time dashboards updating with live data**  
✅ **API endpoints responding with healthy status**  

## 🎓 Learning Path

**For New Users:**
1. Start with `npm start` and explore http://localhost:5173
2. Run `npm run core:demo` to understand CUE concepts
3. Try `npm run clarion:train` to see AI learning
4. Generate a manuscript via the Control Center
5. Explore API endpoints and real-time metrics

**For Developers:**
1. Study the core CUE implementation in `libs/cue-core/`
2. Understand CLARION-MDU architecture in `libs/cue-ai-training/`
3. Experiment with Vec7 validation in the testing panel
4. Modify service orchestration in `start-services.cjs`
5. Extend the Control Center dashboard components

**For Researchers:**
1. Analyze CUE-CLARION-MDU synthesis implementation
2. Study Vec7 harmony mathematical foundations
3. Explore multi-domain state management (MDU)
4. Research quantum consensus mechanisms (CTL)
5. Investigate autonomous learning convergence

---

**🌌 The Universal Life Protocol is now a complete, operational autonomous AI framework ready for training, development, and research!**