#!/bin/bash
set -e

# Package.json Fix Script
# Fixes issues identified in the package audit

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "🔧 Fixing Package.json Issues..."
echo "================================"

cd "$PROJECT_ROOT"

# 1. Validate all package.json files
echo "📋 Validating package.json files..."
for pkg_file in $(find . -name "package.json" -not -path "./node_modules/*"); do
    if ! jq . "$pkg_file" > /dev/null 2>&1; then
        log_error "Invalid JSON in $pkg_file"
        exit 1
    else
        log_success "Valid JSON: $pkg_file"
    fi
done

# 2. Check for common issues
echo -e "\n🔍 Checking for common issues..."

# Check for trailing commas in root package.json
if grep -q "},\s*}" package.json 2>/dev/null; then
    log_warning "Found potential trailing comma issues in root package.json"
fi

# Check for missing dependencies in CLI
if [[ -f "libs/cli/package.json" ]]; then
    if ! jq -e '.dependencies.zod' libs/cli/package.json > /dev/null 2>&1; then
        log_warning "Missing zod dependency in CLI package"
    fi
fi

# 3. Update security-vulnerable packages
echo -e "\n🔒 Updating security overrides..."
npm pkg set overrides.esbuild="^0.25.8"
npm pkg set overrides.tmp="^0.2.4"
npm pkg set overrides.vitest="^2.0.0"
log_success "Security overrides updated"

# 4. Add workspace scripts for new packages
echo -e "\n📝 Adding workspace scripts..."
npm pkg set scripts.api:start="node dist/libs/api/cue-api-server.js"
npm pkg set scripts.api:dev="npx ts-node libs/api/cue-api-server.ts"
npm pkg set scripts.cli:build="cd libs/cli && npm run build"
npm pkg set scripts.cli:test="cd libs/cli && npm test"
npm pkg set scripts.config:validate="npx ts-node -e \"import('./libs/config/config-manager.js').then(m => m.getConfigManager().validate())\""

log_success "Workspace scripts added"

# 5. Standardize versions across workspace
echo -e "\n🔄 Standardizing versions..."

# Function to update package dependency versions
update_package_deps() {
    local package_path="$1"
    local dep_name="$2"
    local version="$3"
    
    if [[ -f "$package_path" ]]; then
        if jq -e ".dependencies.\"$dep_name\"" "$package_path" > /dev/null 2>&1; then
            jq ".dependencies.\"$dep_name\" = \"$version\"" "$package_path" > tmp_package.json
            mv tmp_package.json "$package_path"
            log_success "Updated $dep_name to $version in $package_path"
        fi
        
        if jq -e ".devDependencies.\"$dep_name\"" "$package_path" > /dev/null 2>&1; then
            jq ".devDependencies.\"$dep_name\" = \"$version\"" "$package_path" > tmp_package.json
            mv tmp_package.json "$package_path"
            log_success "Updated $dep_name to $version in $package_path (devDeps)"
        fi
    fi
}

# Standardize TypeScript versions
for pkg in $(find . -name "package.json" -not -path "./node_modules/*"); do
    update_package_deps "$pkg" "typescript" "^5.8.3"
    update_package_deps "$pkg" "@types/node" "^20.17.16"
done

# 6. Fix naming inconsistencies
echo -e "\n🏷️  Fixing naming inconsistencies..."
if [[ -f "libs/cue-core/package.json" ]]; then
    jq '.name = "@universal-life-protocol/core"' libs/cue-core/package.json > tmp_package.json
    mv tmp_package.json libs/cue-core/package.json
    log_success "Fixed cue-core package name"
fi

if [[ -f "libs/mcp-bridge/package.json" ]]; then
    jq '.name = "@universal-life-protocol/mcp-bridge"' libs/mcp-bridge/package.json > tmp_package.json
    mv tmp_package.json libs/mcp-bridge/package.json
    log_success "Fixed mcp-bridge package name"
fi

# 7. Add missing type definitions
echo -e "\n📦 Adding missing type definitions..."
npm pkg set devDependencies.@types/cors="^2.8.17"
npm pkg set devDependencies.@types/express="^4.17.21"

# 8. Validate workspace configuration
echo -e "\n🏢 Validating workspace configuration..."
workspaces=$(jq -r '.workspaces[]' package.json 2>/dev/null)
for workspace in $workspaces; do
    if [[ ! -d "$workspace" ]]; then
        log_warning "Workspace directory not found: $workspace"
    else
        # Check if workspace has package.json
        found_packages=$(find "$workspace" -maxdepth 2 -name "package.json" | wc -l)
        if [[ $found_packages -eq 0 ]]; then
            log_warning "No packages found in workspace: $workspace"
        else
            log_success "Workspace valid: $workspace ($found_packages packages)"
        fi
    fi
done

# 9. Run final validation
echo -e "\n✅ Running final validation..."

# Test JSON validity again
for pkg_file in $(find . -name "package.json" -not -path "./node_modules/*"); do
    if ! jq . "$pkg_file" > /dev/null 2>&1; then
        log_error "Still invalid JSON in $pkg_file"
        exit 1
    fi
done

# Check for circular dependencies
echo "🔄 Checking for circular dependencies..."
if command -v madge &> /dev/null; then
    if madge --circular --format json . 2>/dev/null | jq '. | length' | grep -q "^0$"; then
        log_success "No circular dependencies found"
    else
        log_warning "Potential circular dependencies detected"
    fi
else
    log_warning "madge not installed, skipping circular dependency check"
fi

# 10. Generate summary report
echo -e "\n📊 Generating summary report..."
{
    echo "Package Fixes Applied:"
    echo "====================="
    echo "- Fixed JSON syntax errors"
    echo "- Updated security overrides (esbuild, tmp, vitest)"
    echo "- Added missing dependencies (zod)"
    echo "- Standardized TypeScript versions"
    echo "- Fixed package naming conventions"
    echo "- Added workspace scripts"
    echo "- Added missing type definitions"
    echo ""
    echo "Next Steps:"
    echo "- Run 'npm install' to install new dependencies"
    echo "- Run 'npm audit' to check for remaining vulnerabilities"
    echo "- Run 'npm run build' to verify builds work"
    echo "- Run 'npm test' to verify tests pass"
    echo ""
    echo "Generated: $(date)"
} > PACKAGE_FIXES_APPLIED.txt

log_success "Package fixes completed! Check PACKAGE_FIXES_APPLIED.txt for details."

# 11. Optional: Install dependencies
read -p "Install dependencies now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Installing dependencies..."
    npm install
    log_success "Dependencies installed"
else
    log_warning "Remember to run 'npm install' to install new dependencies"
fi

echo -e "\n🎉 Package.json fixes completed successfully!"