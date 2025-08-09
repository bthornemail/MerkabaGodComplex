#!/bin/bash

# ULP Load Testing Script
# Runs comprehensive load tests using k6 and Artillery for third-party verification

set -e

# Configuration
WS_URL="${WS_URL:-ws://localhost:8083}"
HTTP_URL="${HTTP_URL:-http://localhost:3002}"
RESULTS_DIR="load-test-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🚀 ULP Load Testing Suite - Third Party Verification"
echo "=================================================="
echo "WebSocket URL: $WS_URL"
echo "HTTP URL: $HTTP_URL"
echo "Results Directory: $RESULTS_DIR/$TIMESTAMP"
echo ""

# Create results directory
mkdir -p "$RESULTS_DIR/$TIMESTAMP"

# Check if k6 is installed
if ! command -v k6 &> /dev/null; then
    echo "❌ k6 not found. Installing k6..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install k6
    else
        # Linux installation
        sudo gpg -k
        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update
        sudo apt-get install k6
    fi
fi

# Check if Artillery is installed
if ! command -v artillery &> /dev/null; then
    echo "❌ Artillery not found. Installing Artillery..."
    npm install -g artillery@latest
fi

echo "✅ Load testing tools ready"
echo ""

# Function to check if service is running
check_service() {
    local url=$1
    local service_name=$2
    
    if curl -s --fail -o /dev/null "$url" || nc -z localhost $(echo $url | cut -d':' -f3 | cut -d'/' -f1) 2>/dev/null; then
        echo "✅ $service_name is running"
        return 0
    else
        echo "⚠️  $service_name may not be running at $url"
        return 1
    fi
}

# Check services (optional - tests can run against staging too)
echo "🔍 Checking service availability..."
if [[ $WS_URL == ws://localhost:* ]]; then
    check_service "http://localhost:8083" "Control Center WebSocket" || echo "   Will attempt connection anyway..."
fi

if [[ $HTTP_URL == http://localhost:* ]]; then
    check_service "$HTTP_URL/health" "HTTP API" || echo "   Will attempt connection anyway..."
fi
echo ""

# Run k6 WebSocket load test
echo "🔥 Running k6 WebSocket Load Test..."
echo "Target: $WS_URL"
echo "Duration: ~14 minutes (staged load test)"
echo ""

WS_URL=$WS_URL k6 run \
    --out json="$RESULTS_DIR/$TIMESTAMP/k6-results.json" \
    --summary-export="$RESULTS_DIR/$TIMESTAMP/k6-summary.json" \
    scripts/k6-ws-benchmark.js \
    2>&1 | tee "$RESULTS_DIR/$TIMESTAMP/k6-console.log"

echo ""
echo "✅ k6 WebSocket test completed"
echo "📊 Results saved to: $RESULTS_DIR/$TIMESTAMP/k6-*"
echo ""

# Run Artillery mixed load test  
echo "🎯 Running Artillery Mixed Load Test..."
echo "Target: $WS_URL (WebSocket) + $HTTP_URL (HTTP)"
echo "Duration: ~9 minutes (phased load test)"
echo ""

# Update Artillery config with current URLs
sed -i.bak "s|target: \"ws://localhost:8083\"|target: \"$WS_URL\"|g" scripts/artillery-load-test.yml

artillery run \
    scripts/artillery-load-test.yml \
    --output "$RESULTS_DIR/$TIMESTAMP/artillery-report.json" \
    2>&1 | tee "$RESULTS_DIR/$TIMESTAMP/artillery-console.log"

# Generate Artillery HTML report
artillery report \
    "$RESULTS_DIR/$TIMESTAMP/artillery-report.json" \
    --output "$RESULTS_DIR/$TIMESTAMP/artillery-report.html"

# Restore original config
mv scripts/artillery-load-test.yml.bak scripts/artillery-load-test.yml

echo ""
echo "✅ Artillery mixed load test completed" 
echo "📊 Results saved to: $RESULTS_DIR/$TIMESTAMP/artillery-*"
echo ""

# Generate comprehensive summary report
echo "📋 Generating Load Test Summary Report..."

cat > "$RESULTS_DIR/$TIMESTAMP/load-test-summary.md" << EOF
# ULP Load Test Results - $TIMESTAMP

## Test Configuration
- **WebSocket Target**: $WS_URL
- **HTTP Target**: $HTTP_URL  
- **Test Duration**: ~23 minutes total
- **Generated**: $(date -u '+%Y-%m-%d %H:%M:%S UTC')
- **Git Commit**: $(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')

## Test Suite Overview

### k6 WebSocket Load Test
- **Tool**: k6 v$(k6 version --quiet 2>/dev/null || echo 'unknown')
- **Scenario**: Staged load testing (50 → 200 → 500 → 200 → 0 VUs)
- **Focus**: WebSocket connection stability, message latency, CUE event handling
- **Results**: See \`k6-*.json\` and \`k6-console.log\`

### Artillery Mixed Load Test  
- **Tool**: Artillery v$(artillery version 2>/dev/null | head -1 || echo 'unknown')
- **Scenario**: WebSocket + HTTP API mixed workload
- **Focus**: Real-world usage patterns, API throughput, concurrent operations
- **Results**: See \`artillery-report.html\` and \`artillery-report.json\`

## Performance Targets (from Verification Plan)

| Metric | Target | k6 Result | Artillery Result | Status |
|--------|---------|-----------|------------------|---------|
| WS Concurrent Connections | 1000+ | TBD | TBD | 🔍 |
| WS Message Throughput | 10,000+ msg/s | TBD | TBD | 🔍 |
| WS p95 Latency | < 50ms | TBD | TBD | 🔍 |
| WS p99 Latency | < 100ms | TBD | TBD | 🔍 |
| HTTP p95 Response | < 200ms | N/A | TBD | 🔍 |
| Connection Success Rate | > 95% | TBD | TBD | 🔍 |

*TBD = To Be Determined (check individual result files)*

## Files Generated
- \`k6-results.json\` - Detailed k6 metrics and timeseries
- \`k6-summary.json\` - k6 test summary with thresholds
- \`k6-console.log\` - k6 console output and errors
- \`artillery-report.json\` - Raw Artillery test data
- \`artillery-report.html\` - Interactive Artillery dashboard
- \`artillery-console.log\` - Artillery console output
- \`load-test-summary.md\` - This summary report

## Third-Party Verification
This test suite is designed for independent verification by:
- Security firms (Trail of Bits, NCC Group, Bishop Fox, Zellic)
- Load testing providers (k6 Cloud, Artillery Pro)
- Performance auditors

## Next Steps
1. Review individual test results for threshold compliance
2. Analyze any performance bottlenecks or failures
3. Cross-reference with OpenTelemetry metrics from instrumented services
4. Schedule follow-up tests after any optimizations

## Contact
For questions about these results or verification methodology, please reference:
- [Verification & Benchmarking Plan](../VERIFICATION_BENCHMARKING.md)
- [Staging Configuration](../staging-config.json)
- [GitHub Issues](https://github.com/universallifeprotocol/UniversalLifeProtocol/issues)

EOF

echo "✅ Load test summary generated"
echo ""

# Final results summary
echo "🎉 ULP Load Testing Suite Complete!"
echo "================================================"
echo "📁 All results saved to: $RESULTS_DIR/$TIMESTAMP/"
echo ""
echo "📊 Key Files:"
echo "   - load-test-summary.md (overview)"
echo "   - k6-results.json (WebSocket performance data)"
echo "   - artillery-report.html (interactive mixed load results)"
echo ""
echo "🔍 Next Steps:"
echo "   1. Review threshold compliance in result files"
echo "   2. Check OpenTelemetry metrics in your monitoring stack"
echo "   3. Share results with third-party verification teams"
echo ""
echo "🚀 Ready for third-party verification!"

# Open results if running locally
if [[ -n "$DISPLAY" ]] && command -v xdg-open &> /dev/null; then
    echo ""
    echo "📱 Opening Artillery report in browser..."
    xdg-open "$RESULTS_DIR/$TIMESTAMP/artillery-report.html"
elif [[ "$OSTYPE" == "darwin"* ]] && command -v open &> /dev/null; then
    echo ""
    echo "📱 Opening Artillery report in browser..."
    open "$RESULTS_DIR/$TIMESTAMP/artillery-report.html"
fi