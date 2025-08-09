import { SimplePeer } from '../core/simple-peer';
import chalk from 'chalk';

async function main() {
  console.log(chalk.bold.yellow('--- Starting CUE Bootstrap Node ---'));
  const bootstrap = new SimplePeer('./peer-state-bootstrap.json');
  await bootstrap.start();
  
  console.log(chalk.yellow('Bootstrap node is running. Other nodes can now connect.'));
  
  // Keep the process alive
  setInterval(() => {}, 1000);
}
main();