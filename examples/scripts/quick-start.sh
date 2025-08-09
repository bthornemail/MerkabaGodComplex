#!/bin/bash

# CUE Development Quick Start
# Primary Focus: Autonomous CUE AI with CLARION-MDU

echo "🚀 Universal Life Protocol - CUE Development Environment"
echo "Primary Goal: Autonomous CUE AI with CLARION-MDU"
echo "Secondary Goal: Book manuscript generation"
echo ""

# Check if Ollama is running
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running"
else
    echo "⚠️  Ollama not running. Start with: ollama serve"
fi

echo ""
echo "🎯 Available Commands:"
echo ""
echo "Primary (Autonomous CUE AI):"
echo "  npm run clarion:train          # Train CLARION-MDU system"  
echo "  npm run clarion:status         # Check training status"
echo "  npm run core:demo              # Run CUE core demo"
echo "  npm run core:test              # Test CUE framework"
echo ""
echo "Secondary (Book Generation):"
echo "  npm run ai-training:demo       # AI-assisted manuscript"
echo "  npm run ai-training:benchmark  # Performance metrics"  
echo ""
echo "Development Tools:"
echo "  npm run ollama:test            # Test Ollama connectivity"
echo "  npm run ollama:demo            # Run Ollama integration demo"
echo "  npm run agents:status          # Check LLM agent folders"
echo ""
echo "Applications:"
echo "  npm run control-center:dev     # Start web dashboard"
echo "  npm run dashboard:dev          # Start legacy dashboard"
echo ""
echo "🎮 Quick Start: npm run clarion:train"
