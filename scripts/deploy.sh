#!/bin/bash
set -e

# CUE System Deployment Script
# Comprehensive deployment automation for the Computational Universe Engine

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEPLOY_ENV="${DEPLOY_ENV:-staging}"
DEPLOY_TARGET="${DEPLOY_TARGET:-local}"
CONFIG_FILE="${CONFIG_FILE:-cue-config.json}"
LOG_FILE="${PROJECT_ROOT}/logs/deploy-$(date +%Y%m%d_%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}" | tee -a "$LOG_FILE"
}

# Utility functions
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "Command '$1' is required but not installed"
        exit 1
    fi
}

check_file() {
    if [[ ! -f "$1" ]]; then
        log_error "Required file '$1' not found"
        exit 1
    fi
}

check_directory() {
    if [[ ! -d "$1" ]]; then
        log_error "Required directory '$1' not found"
        exit 1
    fi
}

# Pre-deployment checks
pre_deployment_checks() {
    log "🔍 Running pre-deployment checks..."
    
    # Check required commands
    check_command "node"
    check_command "npm"
    check_command "git"
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d 'v' -f 2)
    REQUIRED_NODE_VERSION="18.0.0"
    
    if ! node -p "process.versions.node.localeCompare('$REQUIRED_NODE_VERSION', undefined, {numeric: true}) >= 0"; then
        log_error "Node.js version $REQUIRED_NODE_VERSION or higher is required (current: $NODE_VERSION)"
        exit 1
    fi
    
    # Check project structure
    check_directory "$PROJECT_ROOT"
    check_file "$PROJECT_ROOT/package.json"
    
    # Check for uncommitted changes
    if [[ -n $(git status --porcelain) ]] && [[ "$DEPLOY_ENV" == "production" ]]; then
        log_error "Uncommitted changes detected. Please commit or stash changes before deploying to production"
        exit 1
    fi
    
    log_success "Pre-deployment checks completed"
}

# Environment setup
setup_environment() {
    log "🌍 Setting up environment: $DEPLOY_ENV"
    
    # Create necessary directories
    mkdir -p "$PROJECT_ROOT/logs"
    mkdir -p "$PROJECT_ROOT/data/backups"
    mkdir -p "$PROJECT_ROOT/tmp"
    
    # Set environment variables
    export NODE_ENV="$DEPLOY_ENV"
    export CUE_DEPLOY_TARGET="$DEPLOY_TARGET"
    
    # Load environment-specific configuration
    if [[ -f "$PROJECT_ROOT/.env.$DEPLOY_ENV" ]]; then
        log "Loading environment configuration from .env.$DEPLOY_ENV"
        source "$PROJECT_ROOT/.env.$DEPLOY_ENV"
    fi
    
    log_success "Environment setup completed"
}

# Dependencies installation
install_dependencies() {
    log "📦 Installing dependencies..."
    
    cd "$PROJECT_ROOT"
    
    # Install root dependencies
    npm ci --production=false
    
    # Install workspace dependencies
    if [[ -f "package-lock.json" ]] && grep -q "workspaces" package.json; then
        log "Installing workspace dependencies..."
        npm run install:all || {
            log_warning "Workspace install failed, trying individual packages..."
            
            # Install libs dependencies
            for lib_dir in libs/*/; do
                if [[ -f "${lib_dir}package.json" ]]; then
                    log "Installing dependencies for ${lib_dir}"
                    (cd "$lib_dir" && npm ci) || log_warning "Failed to install ${lib_dir} dependencies"
                fi
            done
            
            # Install app dependencies
            for app_dir in apps/*/; do
                if [[ -f "${app_dir}package.json" ]]; then
                    log "Installing dependencies for ${app_dir}"
                    (cd "$app_dir" && npm ci) || log_warning "Failed to install ${app_dir} dependencies"
                fi
            done
        }
    fi
    
    log_success "Dependencies installed"
}

# Build process
build_application() {
    log "🔨 Building application..."
    
    cd "$PROJECT_ROOT"
    
    # Run build script
    npm run build || {
        log_error "Build failed"
        exit 1
    }
    
    # Verify build artifacts
    if [[ ! -d "dist" ]]; then
        log_error "Build artifacts not found"
        exit 1
    fi
    
    # Build size check
    BUILD_SIZE=$(du -sh dist | cut -f1)
    log "Build size: $BUILD_SIZE"
    
    log_success "Application built successfully"
}

# Configuration deployment
deploy_configuration() {
    log "⚙️ Deploying configuration..."
    
    # Generate configuration file if it doesn't exist
    if [[ ! -f "$PROJECT_ROOT/$CONFIG_FILE" ]]; then
        log "Generating configuration from template..."
        
        cat > "$PROJECT_ROOT/$CONFIG_FILE" << EOF
{
  "environment": "$DEPLOY_ENV",
  "debug": $([ "$DEPLOY_ENV" = "development" ] && echo "true" || echo "false"),
  "api": {
    "server": {
      "host": "${CUE_API_HOST:-localhost}",
      "port": ${CUE_API_PORT:-3000}
    }
  },
  "logging": {
    "level": "${CUE_LOG_LEVEL:-info}",
    "file": {
      "path": "./logs/cue-${DEPLOY_ENV}.log"
    }
  }
}
EOF
    fi
    
    # Validate configuration
    if command -v jq &> /dev/null; then
        if ! jq . "$PROJECT_ROOT/$CONFIG_FILE" > /dev/null 2>&1; then
            log_error "Invalid configuration file"
            exit 1
        fi
    fi
    
    log_success "Configuration deployed"
}

# Database/Data setup
setup_data() {
    log "💾 Setting up data layer..."
    
    # Create data directories
    mkdir -p "$PROJECT_ROOT/data/entities"
    mkdir -p "$PROJECT_ROOT/data/simulation"
    mkdir -p "$PROJECT_ROOT/data/consciousness"
    
    # Initialize data files if they don't exist
    if [[ ! -f "$PROJECT_ROOT/data/entities.json" ]]; then
        echo '{"entities": [], "lastUpdate": "'$(date -Iseconds)'"}' > "$PROJECT_ROOT/data/entities.json"
    fi
    
    if [[ ! -f "$PROJECT_ROOT/data/simulation-state.json" ]]; then
        echo '{"currentStep": 0, "isRunning": false, "events": []}' > "$PROJECT_ROOT/data/simulation-state.json"
    fi
    
    log_success "Data layer setup completed"
}

# Service deployment
deploy_services() {
    log "🚀 Deploying services..."
    
    case "$DEPLOY_TARGET" in
        "local")
            deploy_local_services
            ;;
        "docker")
            deploy_docker_services
            ;;
        "kubernetes")
            deploy_kubernetes_services
            ;;
        "pm2")
            deploy_pm2_services
            ;;
        *)
            log_error "Unknown deployment target: $DEPLOY_TARGET"
            exit 1
            ;;
    esac
    
    log_success "Services deployed"
}

# Local deployment
deploy_local_services() {
    log "📍 Deploying to local environment..."
    
    # Create systemd service files for production
    if [[ "$DEPLOY_ENV" == "production" ]] && command -v systemctl &> /dev/null; then
        create_systemd_services
    else
        # Start services directly
        log "Starting CUE API server..."
        
        # Kill existing processes
        pkill -f "cue-api-server" || true
        pkill -f "node.*dist.*" || true
        
        # Start API server
        cd "$PROJECT_ROOT"
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
            log_warning "API server health check failed"
        fi
    fi
}

# Docker deployment
deploy_docker_services() {
    log "🐳 Deploying with Docker..."
    
    check_command "docker"
    
    # Build Docker image
    docker build -t cue-system:latest -f docker/Dockerfile .
    
    # Stop existing containers
    docker stop cue-api cue-worker || true
    docker rm cue-api cue-worker || true
    
    # Run API container
    docker run -d \
        --name cue-api \
        -p 3000:3000 \
        -v "$PROJECT_ROOT/data:/app/data" \
        -v "$PROJECT_ROOT/logs:/app/logs" \
        -e NODE_ENV="$DEPLOY_ENV" \
        cue-system:latest
    
    log_success "Docker services deployed"
}

# PM2 deployment
deploy_pm2_services() {
    log "⚡ Deploying with PM2..."
    
    check_command "pm2"
    
    # Create PM2 ecosystem file
    cat > "$PROJECT_ROOT/ecosystem.config.js" << EOF
module.exports = {
  apps: [
    {
      name: 'cue-api',
      script: './dist/libs/api/cue-api-server.js',
      instances: ${PM2_INSTANCES:-1},
      exec_mode: '$([ "${PM2_INSTANCES:-1}" -gt 1 ] && echo "cluster" || echo "fork")',
      env: {
        NODE_ENV: '$DEPLOY_ENV',
        PORT: 3000
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true
    }
  ]
};
EOF
    
    # Deploy with PM2
    pm2 start ecosystem.config.js
    pm2 save
    
    # Setup PM2 startup script for production
    if [[ "$DEPLOY_ENV" == "production" ]]; then
        pm2 startup
    fi
    
    log_success "PM2 services deployed"
}

# Kubernetes deployment
deploy_kubernetes_services() {
    log "☸️ Deploying to Kubernetes..."
    
    check_command "kubectl"
    
    # Apply Kubernetes manifests
    if [[ -d "$PROJECT_ROOT/k8s" ]]; then
        kubectl apply -f "$PROJECT_ROOT/k8s/"
        
        # Wait for deployment
        kubectl rollout status deployment/cue-api
        
        # Get service info
        kubectl get services cue-api
    else
        log_error "Kubernetes manifests not found in k8s/ directory"
        exit 1
    fi
    
    log_success "Kubernetes deployment completed"
}

# Create systemd services
create_systemd_services() {
    log "Creating systemd service files..."
    
    # CUE API Service
    cat > "/tmp/cue-api.service" << EOF
[Unit]
Description=CUE API Server
After=network.target

[Service]
Type=simple
User=cue
WorkingDirectory=$PROJECT_ROOT
Environment=NODE_ENV=$DEPLOY_ENV
ExecStart=$(which node) $PROJECT_ROOT/dist/libs/api/cue-api-server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=cue-api

[Install]
WantedBy=multi-user.target
EOF
    
    # Install service files (requires sudo)
    if [[ $EUID -eq 0 ]]; then
        mv /tmp/cue-api.service /etc/systemd/system/
        systemctl daemon-reload
        systemctl enable cue-api
        systemctl start cue-api
        log_success "Systemd services created and started"
    else
        log_warning "Service files created in /tmp. Run with sudo to install:"
        log "sudo mv /tmp/cue-api.service /etc/systemd/system/"
        log "sudo systemctl daemon-reload"
        log "sudo systemctl enable cue-api"
        log "sudo systemctl start cue-api"
    fi
}

# Post-deployment verification
post_deployment_verification() {
    log "✅ Running post-deployment verification..."
    
    # Wait for services to start
    sleep 5
    
    # Health checks
    local health_check_url="http://localhost:3000/health"
    local max_retries=30
    local retry_count=0
    
    while [[ $retry_count -lt $max_retries ]]; do
        if curl -f "$health_check_url" > /dev/null 2>&1; then
            log_success "Health check passed"
            break
        else
            log "Health check attempt $((retry_count + 1))/$max_retries failed, retrying..."
            sleep 2
            ((retry_count++))
        fi
    done
    
    if [[ $retry_count -eq $max_retries ]]; then
        log_error "Health check failed after $max_retries attempts"
        exit 1
    fi
    
    # API functionality tests
    if curl -f "http://localhost:3000/api/network/status" > /dev/null 2>&1; then
        log_success "API endpoints accessible"
    else
        log_warning "API endpoints may not be fully functional"
    fi
    
    # Log deployment info
    log "Deployment completed successfully!"
    log "Environment: $DEPLOY_ENV"
    log "Target: $DEPLOY_TARGET"
    log "Build size: $(du -sh dist 2>/dev/null | cut -f1 || echo 'N/A')"
    log "API URL: http://localhost:3000"
    log "Health check: $health_check_url"
    log "Logs: $LOG_FILE"
}

# Rollback function
rollback_deployment() {
    log_warning "Rolling back deployment..."
    
    case "$DEPLOY_TARGET" in
        "local")
            # Kill processes
            if [[ -f "tmp/api-server.pid" ]]; then
                kill $(cat tmp/api-server.pid) || true
                rm tmp/api-server.pid
            fi
            ;;
        "docker")
            docker stop cue-api cue-worker || true
            ;;
        "pm2")
            pm2 delete all || true
            ;;
        "kubernetes")
            kubectl rollout undo deployment/cue-api || true
            ;;
    esac
    
    log_warning "Rollback completed"
}

# Cleanup function
cleanup() {
    log "🧹 Performing cleanup..."
    
    # Clean temporary files
    rm -rf "$PROJECT_ROOT/tmp/deploy-*"
    
    # Clean old log files (keep last 30 days)
    find "$PROJECT_ROOT/logs" -name "deploy-*.log" -mtime +30 -delete 2>/dev/null || true
    
    # Clean old backups (keep last 10)
    cd "$PROJECT_ROOT/data/backups" 2>/dev/null && {
        ls -t backup-*.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f
    } || true
    
    log_success "Cleanup completed"
}

# Create backup before deployment
create_backup() {
    log "💾 Creating backup..."
    
    local backup_dir="$PROJECT_ROOT/data/backups"
    local backup_file="backup-$(date +%Y%m%d_%H%M%S).tar.gz"
    
    mkdir -p "$backup_dir"
    
    tar -czf "$backup_dir/$backup_file" \
        --exclude="node_modules" \
        --exclude="logs" \
        --exclude="tmp" \
        --exclude=".git" \
        -C "$PROJECT_ROOT" .
    
    log_success "Backup created: $backup_file"
}

# Signal handlers
trap 'log_error "Deployment interrupted"; rollback_deployment; exit 1' INT TERM
trap 'cleanup' EXIT

# Help function
show_help() {
    cat << EOF
CUE System Deployment Script

Usage: $0 [OPTIONS]

Options:
    -e, --env ENV           Deployment environment (development|staging|production) [default: staging]
    -t, --target TARGET     Deployment target (local|docker|kubernetes|pm2) [default: local]
    -c, --config CONFIG     Configuration file [default: cue-config.json]
    -b, --backup           Create backup before deployment
    -h, --help             Show this help message
    --skip-checks          Skip pre-deployment checks
    --skip-build           Skip build process
    --rollback             Rollback last deployment

Environment Variables:
    DEPLOY_ENV             Deployment environment
    DEPLOY_TARGET          Deployment target
    CONFIG_FILE            Configuration file path
    CUE_API_HOST          API server host
    CUE_API_PORT          API server port
    PM2_INSTANCES         Number of PM2 instances

Examples:
    $0                                    # Deploy to staging (local)
    $0 -e production -t pm2              # Deploy to production with PM2
    $0 -e development -t docker --backup # Deploy to dev with Docker and backup
    $0 --rollback                        # Rollback last deployment

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            DEPLOY_ENV="$2"
            shift 2
            ;;
        -t|--target)
            DEPLOY_TARGET="$2"
            shift 2
            ;;
        -c|--config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        -b|--backup)
            CREATE_BACKUP=true
            shift
            ;;
        --skip-checks)
            SKIP_CHECKS=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --rollback)
            ROLLBACK=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main deployment flow
main() {
    log "🚀 Starting CUE System deployment..."
    log "Environment: $DEPLOY_ENV"
    log "Target: $DEPLOY_TARGET"
    log "Log file: $LOG_FILE"
    
    if [[ "$ROLLBACK" == "true" ]]; then
        rollback_deployment
        exit 0
    fi
    
    if [[ "$CREATE_BACKUP" == "true" ]]; then
        create_backup
    fi
    
    if [[ "$SKIP_CHECKS" != "true" ]]; then
        pre_deployment_checks
    fi
    
    setup_environment
    install_dependencies
    
    if [[ "$SKIP_BUILD" != "true" ]]; then
        build_application
    fi
    
    deploy_configuration
    setup_data
    deploy_services
    post_deployment_verification
    
    log_success "🎉 Deployment completed successfully!"
}

# Run main function
main "$@"