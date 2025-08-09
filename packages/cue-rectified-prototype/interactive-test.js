#!/usr/bin/env node

const { SimplePeer } = require('./dist/core/simple-peer');
const chalk = require('chalk');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let peers = [];
let currentPeer = null;

console.log(chalk.bold.cyan('=== Interactive CUE Testing Environment ===\n'));
console.log(chalk.yellow('Available commands:'));
console.log('  create-peer <name>  - Create a new peer');
console.log('  list-peers         - List all peers');
console.log('  select-peer <id>   - Select a peer to use');
console.log('  connect-peers      - Connect all peers together');
console.log('  send-event <type>  - Send an event from current peer');
console.log('  demo-scenario      - Run a quick demo scenario');
console.log('  help              - Show this help');
console.log('  exit              - Exit the program\n');

function prompt() {
  rl.question(chalk.blue('CUE> '), async (input) => {
    const [command, ...args] = input.trim().split(' ');
    
    try {
      switch (command) {
        case 'create-peer':
          const peerName = args[0] || `peer-${peers.length + 1}`;
          const peer = new SimplePeer(`./test-${peerName}.json`);
          peers.push({ name: peerName, peer });
          console.log(chalk.green(`✅ Created peer: ${peerName}`));
          if (!currentPeer) currentPeer = peer;
          break;
          
        case 'list-peers':
          console.log(chalk.yellow('Active peers:'));
          peers.forEach((p, i) => {
            const status = p.peer === currentPeer ? '👆 SELECTED' : '';
            console.log(`  ${i + 1}. ${p.name} ${status}`);
          });
          break;
          
        case 'select-peer':
          const peerId = parseInt(args[0]) - 1;
          if (peers[peerId]) {
            currentPeer = peers[peerId].peer;
            console.log(chalk.green(`✅ Selected peer: ${peers[peerId].name}`));
          } else {
            console.log(chalk.red('❌ Invalid peer ID'));
          }
          break;
          
        case 'connect-peers':
          if (peers.length < 2) {
            console.log(chalk.red('❌ Need at least 2 peers to connect'));
            break;
          }
          
          // Connect all peers to the first one (bootstrap)
          const bootstrap = peers[0].peer;
          for (let i = 1; i < peers.length; i++) {
            await peers[i].peer.start([bootstrap]);
          }
          console.log(chalk.green(`✅ Connected ${peers.length} peers`));
          break;
          
        case 'send-event':
          if (!currentPeer) {
            console.log(chalk.red('❌ No peer selected. Use create-peer first.'));
            break;
          }
          
          const eventType = args[0] || 'SENSOR_READING';
          const event = {
            type: eventType,
            level: 'LOCAL',
            payload: {
              sensorId: 'TEST_SENSOR',
              value: Math.random() * 30 + 10, // Random temp 10-40
              timestamp: Date.now()
            },
            timestamp: Date.now()
          };
          
          await currentPeer.broadcast(event);
          console.log(chalk.green(`✅ Sent ${eventType} event`));
          break;
          
        case 'demo-scenario':
          console.log(chalk.yellow('🎬 Running demo scenario...'));
          
          // Create 3 peers if not exist
          if (peers.length === 0) {
            const peerNames = ['bootstrap', 'provider', 'agent'];
            for (const name of peerNames) {
              const p = new SimplePeer(`./demo-${name}.json`);
              peers.push({ name, peer: p });
            }
            currentPeer = peers[0].peer;
            console.log(chalk.green('Created 3 demo peers'));
          }
          
          // Connect them
          if (peers.length >= 2) {
            const bootstrap = peers[0].peer;
            for (let i = 1; i < peers.length; i++) {
              await peers[i].peer.start([bootstrap]);
            }
            console.log(chalk.green('Connected all peers'));
          }
          
          // Send some events
          const events = [
            { type: 'SENSOR_READING', temp: 25.5 },
            { type: 'SENSOR_READING', temp: 18.2 },
            { type: 'SENSOR_READING', temp: 30.1 }
          ];
          
          for (const evt of events) {
            const event = {
              type: evt.type,
              level: 'LOCAL',
              payload: { sensorId: 'DEMO_SENSOR', value: evt.temp, timestamp: Date.now() },
              timestamp: Date.now()
            };
            await currentPeer.broadcast(event);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          console.log(chalk.green('✅ Demo scenario complete'));
          break;
          
        case 'help':
          console.log(chalk.yellow('Available commands:'));
          console.log('  create-peer <name>  - Create a new peer');
          console.log('  list-peers         - List all peers');
          console.log('  select-peer <id>   - Select a peer to use');
          console.log('  connect-peers      - Connect all peers together');
          console.log('  send-event <type>  - Send an event from current peer');
          console.log('  demo-scenario      - Run a quick demo scenario');
          console.log('  help              - Show this help');
          console.log('  exit              - Exit the program');
          break;
          
        case 'exit':
          console.log(chalk.green('👋 Goodbye!'));
          rl.close();
          return;
          
        default:
          if (command) {
            console.log(chalk.red(`❌ Unknown command: ${command}. Type 'help' for available commands.`));
          }
      }
    } catch (error) {
      console.log(chalk.red(`❌ Error: ${error.message}`));
    }
    
    prompt();
  });
}

console.log(chalk.green('🚀 Interactive testing environment ready!'));
console.log(chalk.gray('Tip: Start with "demo-scenario" for a quick test, or "create-peer test" to begin manually.\n'));
prompt();