import { SimplePeer } from '../core/simple-peer';
import chalk from 'chalk';

async function main() {
  console.log(chalk.bold.blue('--- Starting CUE Compute Provider Node ---'));
  console.log(chalk.red('Note: This is a simplified demo implementation.'));
  console.log(chalk.red('For full network functionality, use the demo script: npm run demo'));
  
  const provider = new SimplePeer('./peer-state-provider.json');
  await provider.start();
  provider.benchmarkAndAdvertise();
  console.log(chalk.blue('Provider is online and waiting for compute jobs...'));
  
  // Keep process alive
  setInterval(() => {}, 1000);
}
main();