#!/data/data/com.termux/files/usr/bin/bash
# Claude Agent for ULP Environment

echo "🤖 Starting Claude Agent for UniversalLifeProtocol"
echo "================================================"

# Set environment variables
export ULP_HOME="$HOME/UniversalLifeProtocol"
export AURA_BRIDGE_DIR="$ULP_HOME/.aura-bridge"
export CLAUDE_LOG_DIR="$ULP_HOME/.claude-integration/logs"

# Create necessary directories
mkdir -p "$AURA_BRIDGE_DIR/messages"
mkdir -p "$CLAUDE_LOG_DIR"

echo "✅ Claude Agent ready for ULP coordination"
echo "📁 ULP Home: $ULP_HOME"
echo "🌉 AURA Bridge: $AURA_BRIDGE_DIR"
echo "📋 Logs: $CLAUDE_LOG_DIR"
echo ""
echo "🎯 Claude can now coordinate with AURA and ULP systems"

# Monitor AURA messages
if [ -d "$AURA_BRIDGE_DIR/messages" ]; then
    echo "📨 Monitoring AURA messages..."
    watch -n 5 "ls -la $AURA_BRIDGE_DIR/messages/ 2>/dev/null | tail -5"
else
    echo "⚠️ AURA bridge messages directory not found"
fi
