# 📁 Universal Life Protocol - Directory Structure

This guide explains the organized structure of the Universal Life Protocol repository.

## 🏗️ Root Directory Structure

### 📄 Configuration Files (Root Level)
- `package.json` - Main package configuration
- `package-lock.json`, `yarn.lock` - Dependency locks
- `tsconfig.json`, `tsconfig.*.json` - TypeScript configuration
- `eslint.config.js` - Linting configuration
- `vitest.config.ts` - Testing configuration
- `LICENSE` - MIT License
- `README.md` - Main project documentation

### 📁 Core Directories

#### `/apps/` - Application Frontend
- `control-center/` - React dashboard for system monitoring
- `dashboard/` - Legacy dashboard interface
- `knowledge-trie/` - Interactive knowledge visualization
- `personality-onboarding/` - User personality assessment
- `public-portal/` - Public-facing portal

#### `/libs/` - Core Libraries
- `cue-core/` - Computational Universe Engine core
- `cue-protocols/` - Protocol implementations
- `cue-ai-training/` - AI training and manuscript generation
- `cue-agents/` - Conscious agents and meta-observers
- `visualization/` - Knowledge graph visualization
- `mcp-bridge/` - Model Context Protocol integration

#### `/docs/` - Documentation
- `api/` - API reference documentation
- `guides/` - User and developer guides
- `production/` - Production deployment guides
- `status-reports/` - System status reports
- `project-info/` - Project announcements and info

#### `/examples/` - Examples and Demos
- `demos/` - Interactive demonstration scripts
- `interfaces/` - HTML user interfaces
- `data/` - Sample data and test outputs
- `mcp/` - MCP integration examples

#### `/public/` - Static Assets
- `audio/` - Generated audio explanations
- `video/` - Visualization videos
- `views/` - Interactive HTML visualizations
- `config/` - Configuration files for services

#### `/tools/` - Development Tools
- `benchmarking/` - Performance benchmarks
- `testing/` - Test utilities and suites

### 🎯 Key Entry Points

#### For Developers
- `libs/cue-core/index.ts` - Core CUE functionality
- `libs/cue-protocols/living-knowledge-trie.ts` - Living knowledge system
- `apps/control-center/` - System monitoring dashboard

#### For Users
- `examples/demos/quick-demo.js` - Quick start demonstration
- `examples/interfaces/ulp-visual-knowledge-interface.html` - Interactive interface
- `docs/GETTING_STARTED_GUIDE.md` - Complete setup guide

#### For Production
- `dist/` - Built package for npm distribution
- `tools/testing/` - Production testing suites
- `docs/production/` - Deployment guides

### 📦 NPM Package
- Published as: `universal-life-protocol-core`
- Install: `npm install universal-life-protocol-core`
- Documentation: Included in package

### 🚀 Quick Start
1. Clone repository
2. `npm install` - Install dependencies
3. `node examples/demos/quick-demo.js` - Run demonstration
4. Open `examples/interfaces/ulp-visual-knowledge-interface.html` - Interactive interface
5. See `docs/GETTING_STARTED_GUIDE.md` for complete setup

This structure provides clear organization for developers, users, and production deployment.
