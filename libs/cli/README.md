# CUE CLI - Computational Universe Engine Command Line Interface

A comprehensive command-line interface for managing the Computational Universe Engine (CUE), providing powerful tools for network management, entity simulation, consciousness modeling, and theoretical analysis.

## Installation

### Global Installation
```bash
npm install -g @universal-life-protocol/cli
```

### Local Development
```bash
cd libs/cli
npm install
npm run build
```

### Using npx
```bash
npx @universal-life-protocol/cli --help
```

## Quick Start

```bash
# Check system health
cue health

# Start interactive mode
cue interactive

# Show network status
cue network status

# Create and evolve an entity
cue entity create my-entity
cue entity evolve my-entity 10

# Run a complete simulation
cue simulation run 5 10
```

## Configuration

The CLI can be configured using:
- Environment variables
- Configuration file (`.cue-config.json`)
- Command-line options

### Environment Variables
```bash
export CUE_API_URL=http://localhost:3000
export CUE_API_KEY=your-api-key
```

### Configuration File
Create `.cue-config.json` in your working directory:
```json
{
  "apiUrl": "http://localhost:3000",
  "apiKey": "your-api-key",
  "timeout": 30000,
  "retries": 3,
  "outputFormat": "table",
  "verbose": false
}
```

### Configuration Commands
```bash
# Show current configuration
cue config show

# Set configuration value
cue config set apiUrl http://production.api:3000
cue config set outputFormat json

# Reset to defaults
cue config reset
```

## Command Reference

### Global Options
- `-v, --verbose` - Enable verbose output
- `-f, --format <format>` - Output format (json|table|yaml)
- `--api-url <url>` - Override API server URL

### Health Commands
```bash
# Check system health and connectivity
cue health
```

### Network Management
```bash
# Show network status
cue network status

# List network peers
cue network peers

# Add a peer to the network
cue network add-peer peer-001 192.168.1.100 8001

# Remove a peer from the network
cue network remove-peer peer-001

# Initialize consensus with 7 validators (Fano plane)
cue network consensus v0 v1 v2 v3 v4 v5 v6

# Run consensus round with optional seed
cue network consensus-round
cue network consensus-round custom-seed-123
```

### Entity Management
```bash
# List all entities
cue entity list

# Create a new entity with default domains
cue entity create my-entity

# Create entity with custom domains
cue entity create complex-entity '{"fibonacci": 7, "prime": 11, "golden": 13}'

# Get entity details
cue entity get my-entity

# Evolve entity through simulation steps
cue entity evolve my-entity 5
cue entity evolve my-entity 100

# Delete an entity (with confirmation)
cue entity delete my-entity
```

### Simulation Control
```bash
# Show simulation status
cue simulation status

# Start the simulation engine
cue simulation start

# Stop the simulation engine
cue simulation stop

# Run simulation steps manually
cue simulation step
cue simulation step 10

# View recent simulation events
cue simulation events
cue simulation events 50

# Run complete simulation (entities, steps)
cue simulation run 10 20
```

### Theoretical Analysis
```bash
# Analyze single MDU (Modulo-Divisive Unfolding) state
cue analysis mdu 42 7
cue analysis mdu 314 31

# Batch analyze MDU states from 0 to N
cue analysis batch-mdu 50
cue analysis batch-mdu 100 13

# Results show L (layer), A (amplitude), and harmonic properties
```

### Interactive Mode
```bash
# Start interactive shell
cue interactive

# In interactive mode:
cue> help                    # Show available commands
cue> health                  # Check health
cue> entity list             # List entities
cue> simulation status       # Show simulation status
cue> analysis mdu 42 7       # Analyze MDU
cue> exit                    # Exit interactive mode
```

## Output Formats

### Table Format (Default)
```bash
cue entity list
┌─────────────┬──────────┬─────────────────┬─────────────────────────┐
│ id          │ currentL │ domains         │ lastUpdate             │
├─────────────┼──────────┼─────────────────┼─────────────────────────┤
│ entity-001  │ 3        │ default         │ 2025-01-15T10:30:00.000Z │
│ entity-002  │ 7        │ fibonacci,prime │ 2025-01-15T10:32:15.000Z │
└─────────────┴──────────┴─────────────────┴─────────────────────────┘
```

### JSON Format
```bash
cue entity list --format json
[
  {
    "id": "entity-001",
    "currentL": 3,
    "domains": "default",
    "lastUpdate": "2025-01-15T10:30:00.000Z"
  }
]
```

### YAML Format
```bash
cue entity list --format yaml
- id: entity-001
  currentL: 3
  domains: default
  lastUpdate: 2025-01-15T10:30:00.000Z
```

## Advanced Usage

### Batch Operations
```bash
# Create multiple entities with domains
for i in {1..5}; do
  cue entity create "batch-entity-$i" '{"default": 7, "secondary": 11}'
done

# Evolve all entities
cue entity list --format json | jq -r '.[].id' | while read id; do
  cue entity evolve "$id" 10
done
```

### Monitoring and Automation
```bash
# Watch network status
watch -n 5 'cue network status'

# Monitor simulation progress
while true; do
  cue simulation status
  sleep 2
done

# Automated simulation runs with logging
cue simulation run 10 50 --format json > simulation-results.json
```

### Configuration Profiles
```bash
# Development profile
cue config set apiUrl http://localhost:3000
cue config set verbose true

# Production profile  
cue config set apiUrl https://production-api.cue.network
cue config set timeout 60000
cue config set retries 5
```

## Error Handling

The CLI provides detailed error messages and handles various failure scenarios:

```bash
# API connection errors
❌ API Error: Connection refused
   Status: ECONNREFUSED
   Request ID: req_1642245123456_1

# Validation errors
❌ API Error: Invalid N or B parameters
   Status: 400
   Request ID: req_1642245123457_2

# Entity not found
❌ API Error: Entity my-entity not found
   Status: 404
   Request ID: req_1642245123458_3
```

## Troubleshooting

### Common Issues

**Connection Refused**
- Ensure CUE API server is running
- Check API URL in configuration
- Verify network connectivity

**Authentication Errors**
- Set correct API key: `cue config set apiKey your-key`
- Check API key permissions

**Command Not Found**
- Install CLI globally: `npm install -g @universal-life-protocol/cli`
- Or use npx: `npx @universal-life-protocol/cli`

**Timeout Errors**
- Increase timeout: `cue config set timeout 60000`
- Check server performance
- Verify network stability

### Debug Mode
```bash
# Enable verbose output for detailed logging
cue --verbose health
cue --verbose simulation run 5 10

# Show configuration and connectivity
cue config show
cue health
```

### Log Analysis
```bash
# View detailed error information
cue --verbose entity evolve non-existent-entity 10

# Check JSON output for programmatic parsing
cue health --format json | jq '.data'
```

## Examples

### Complete Workflow Example
```bash
#!/bin/bash
set -e

echo "🚀 Starting CUE workflow..."

# Check system health
cue health

# Configure for local development
cue config set apiUrl http://localhost:3000
cue config set verbose true

# Initialize network
cue network consensus v0 v1 v2 v3 v4 v5 v6

# Create test entities
cue entity create fibonacci-test '{"fibonacci": 7}'
cue entity create prime-test '{"prime": 11}'
cue entity create golden-test '{"golden": 13}'

# Start simulation
cue simulation start

# Run evolution steps
for entity in fibonacci-test prime-test golden-test; do
  echo "Evolving $entity..."
  cue entity evolve "$entity" 20
done

# Run simulation steps
cue simulation step 10

# Analyze results
echo "Final entity states:"
cue entity list

echo "Recent events:"
cue simulation events 5

# Theoretical analysis
echo "MDU Analysis for key values:"
cue analysis mdu 42 7
cue analysis mdu 144 13

# Stop simulation
cue simulation stop

echo "✅ Workflow completed!"
```

### Research Analysis Script
```bash
#!/bin/bash
# Comprehensive MDU analysis

echo "📊 MDU Research Analysis"

# Analyze Fibonacci sequence with base 7
echo "Fibonacci-7 Analysis:"
cue analysis batch-mdu 89 7 --format json > fibonacci-7.json

# Analyze golden ratio related values with base 13
echo "Golden-13 Analysis:"
for n in 89 144 233 377; do
  cue analysis mdu "$n" 13
done

# Prime number analysis
echo "Prime Analysis:"
for prime in 7 11 13 17 19 23; do
  cue analysis mdu 1000 "$prime" --format json >> prime-analysis.json
done

echo "Analysis complete! Check output files."
```

## API Reference

The CLI interacts with the CUE REST API. For detailed API documentation, see:
- API Server: `/libs/api/cue-api-server.ts`
- Client SDK: `/libs/api/cue-api-client.ts`
- API Demo: `/examples/api-demo.ts`

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-command`
3. Add tests for new commands
4. Update documentation
5. Submit pull request

### Development Commands
```bash
# Install dependencies
npm install

# Development mode with auto-reload
npm run dev -- health

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## License

ISC License - see LICENSE file for details.

## Support

- GitHub Issues: [Report bugs or request features](https://github.com/universallifeprotocol/UniversalLifeProtocol/issues)
- Documentation: [Full project documentation](../../README.md)
- Examples: [API examples and demos](../../examples/)

---

**CUE CLI** - Empowering theoretical exploration through computational modeling.