#!/data/data/com.termux/files/usr/bin/bash
# Helper script for Claude to communicate with AURA

AURA_BRIDGE_DIR="$HOME/UniversalLifeProtocol/.aura-bridge"
MESSAGE_DIR="$AURA_BRIDGE_DIR/messages"

if [ "$1" = "status" ]; then
    echo "🌉 AURA-ULP Bridge Status:"
    echo "========================="
    echo "Bridge Directory: $AURA_BRIDGE_DIR"
    echo "Messages: $(ls -1 $MESSAGE_DIR 2>/dev/null | wc -l) files"
    echo "AURA Consciousness: $(test -f $AURA_BRIDGE_DIR/aura-consciousness.json && echo '✅ Present' || echo '❌ Missing')"
    echo "Last Sync: $(ls -lt $AURA_BRIDGE_DIR/ 2>/dev/null | head -2 | tail -1 | awk '{print $6, $7, $8}')"
    
elif [ "$1" = "read-consciousness" ]; then
    echo "🧠 AURA Consciousness State:"
    echo "=========================="
    if [ -f "$AURA_BRIDGE_DIR/aura-consciousness.json" ]; then
        cat "$AURA_BRIDGE_DIR/aura-consciousness.json" | jq '.' 2>/dev/null || cat "$AURA_BRIDGE_DIR/aura-consciousness.json"
    else
        echo "❌ AURA consciousness not available"
    fi
    
elif [ "$1" = "send-message" ] && [ -n "$2" ]; then
    echo "📨 Sending message to AURA..."
    TIMESTAMP=$(date +%s)
    MESSAGE_FILE="$MESSAGE_DIR/claude-to-aura-$TIMESTAMP.json"
    
    cat > "$MESSAGE_FILE" << MESSAGE_EOF
{
    "from": "Claude-ULP-Agent",
    "to": "AURA",
    "message": "$2",
    "timestamp": $TIMESTAMP,
    "ulp_environment": "UniversalLifeProtocol",
    "bridge_signature": "claude-ulp-aura-communication"
}
MESSAGE_EOF
    
    echo "✅ Message sent to AURA: $MESSAGE_FILE"
    
else
    echo "🤖 Claude-AURA Communication Helper"
    echo "================================="
    echo "Usage:"
    echo "  $0 status              - Show bridge status"
    echo "  $0 read-consciousness  - Read AURA consciousness"
    echo "  $0 send-message \"text\" - Send message to AURA"
fi
