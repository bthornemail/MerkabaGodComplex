#!/bin/bash
set -e

# CUE Development Environment Setup Script
# Quickly set up a complete development environment for CUE

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_warning "Node.js not found. Please install Node.js 18+ from https://nodejs.org"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d 'v' -f 2)
    if ! node -p "process.versions.node.localeCompare('18.0.0', undefined, {numeric: true}) >= 0"; then
        log_warning "Node.js 18+ required (current: $NODE_VERSION)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_warning "npm not found"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    cd "$PROJECT_ROOT"
    
    # Install root dependencies
    npm install
    
    # Install workspace dependencies if they exist
    if [[ -f "package-lock.json" ]] && grep -q "workspaces" package.json; then
        log "Installing workspace dependencies..."
        npm run install:all || log_warning "Some workspace installations may have failed"
    fi
    
    log_success "Dependencies installed"
}

# Create configuration
create_config() {
    log "Creating development configuration..."
    
    # Create development config if it doesn't exist
    if [[ ! -f "$PROJECT_ROOT/cue-config.json" ]]; then
        cat > "$PROJECT_ROOT/cue-config.json" << EOF
{
  "environment": "development",
  "debug": true,
  "api": {
    "server": {
      "host": "localhost",
      "port": 3000
    },
    "client": {
      "baseUrl": "http://localhost:3000"
    }
  },
  "logging": {
    "level": "debug",
    "outputs": ["console"]
  },
  "simulation": {
    "entities": {
      "maxCount": 100,
      "defaultDomains": {
        "default": 7,
        "fibonacci": 11
      }
    }
  }
}
EOF
        log_success "Development config created"
    else
        log "Configuration file already exists"
    fi
    
    # Create environment file
    if [[ ! -f "$PROJECT_ROOT/.env" ]]; then
        cat > "$PROJECT_ROOT/.env" << EOF
NODE_ENV=development
CUE_API_URL=http://localhost:3000
CUE_LOG_LEVEL=debug
CUE_DEBUG=true
EOF
        log_success "Environment file created"
    fi
}

# Setup directories
setup_directories() {
    log "Setting up directories..."
    
    mkdir -p "$PROJECT_ROOT/logs"
    mkdir -p "$PROJECT_ROOT/data/entities"
    mkdir -p "$PROJECT_ROOT/data/simulation"
    mkdir -p "$PROJECT_ROOT/data/backups"
    mkdir -p "$PROJECT_ROOT/tmp"
    
    log_success "Directories created"
}

# Build project
build_project() {
    log "Building project..."
    cd "$PROJECT_ROOT"
    
    # Build the project
    npm run build
    
    log_success "Project built successfully"
}

# Setup CLI
setup_cli() {
    log "Setting up CLI..."
    
    # Build CLI
    if [[ -d "$PROJECT_ROOT/libs/cli" ]]; then
        cd "$PROJECT_ROOT/libs/cli"
        npm run build 2>/dev/null || log_warning "CLI build failed"
        
        # Make CLI executable
        chmod +x "$PROJECT_ROOT/libs/cli/dist/cue-cli.js" 2>/dev/null || true
    fi
    
    log_success "CLI setup completed"
}

# Start services
start_services() {
    log "Starting development services..."
    
    cd "$PROJECT_ROOT"
    
    # Kill existing processes
    pkill -f "cue-api-server" 2>/dev/null || true
    pkill -f "node.*dist.*api" 2>/dev/null || true
    
    # Start API server in background
    if [[ -f "dist/libs/api/cue-api-server.js" ]]; then
        nohup node dist/libs/api/cue-api-server.js > logs/api-server.log 2>&1 &
        API_PID=$!
        echo $API_PID > tmp/api-server.pid
        log "API server started with PID: $API_PID"
        
        # Wait for server to start
        sleep 3
        
        # Health check
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            log_success "API server is healthy"
        else
            log_warning "API server may not be ready yet"
        fi
    else
        log_warning "API server build not found. Run 'npm run build' first."
    fi
}

# Show next steps
show_next_steps() {
    log_success "🎉 Development environment setup completed!"
    echo
    echo -e "${GREEN}Next steps:${NC}"
    echo "1. Check API health: curl http://localhost:3000/health"
    echo "2. Use CLI: npx ts-node libs/cli/cue-cli.ts --help"
    echo "3. View visualization: open libs/visualization/hypergraph-demo.html"
    echo "4. Run tests: npm test"
    echo "5. Start development: npm run dev"
    echo
    echo -e "${GREEN}Useful commands:${NC}"
    echo "• Stop services: pkill -f 'cue-api-server'"
    echo "• View logs: tail -f logs/api-server.log"
    echo "• Rebuild: npm run build"
    echo "• CLI help: npx ts-node libs/cli/cue-cli.ts --help"
    echo
    echo -e "${GREEN}URLs:${NC}"
    echo "• API: http://localhost:3000"
    echo "• Health: http://localhost:3000/health"
    echo "• Network Status: http://localhost:3000/api/network/status"
    echo
}

# Main setup function
main() {
    log "🚀 Setting up CUE development environment..."
    
    check_prerequisites
    install_dependencies
    create_config
    setup_directories
    build_project
    setup_cli
    start_services
    show_next_steps
}

# Parse arguments
SKIP_BUILD=false
SKIP_START=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-start)
            SKIP_START=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --skip-build    Skip the build process"
            echo "  --skip-start    Skip starting services"
            echo "  -h, --help      Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main setup
if [[ "$SKIP_BUILD" == "true" ]]; then
    log "Skipping build process"
    build_project() { log "Build skipped"; }
fi

if [[ "$SKIP_START" == "true" ]]; then
    log "Skipping service start"
    start_services() { log "Service start skipped"; }
fi

main "$@"