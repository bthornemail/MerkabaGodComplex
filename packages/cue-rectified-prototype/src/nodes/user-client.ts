import { SimplePeer } from '../core/simple-peer';
import { CUE_Event, TokenState } from '../common/types';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const BOOTSTRAP_ADDR = "REPLACE_WITH_BOOTSTRAP_ADDRESS";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log(chalk.bold.green('--- Starting CUE User Client Node ---'));
  if (BOOTSTRAP_ADDR.includes("REPLACE")) {
    console.error(chalk.red("Please replace BOOTSTRAP_ADDR in the script."));
    process.exit(1);
  }
  const client = new SimplePeer('./peer-state-client.json');
  await client.start();

  // Mock WASM binary for demo purposes
  const meteredWasmBinary = new Uint8Array([0x00, 0x61, 0x73, 0x6d]); // Mock WASM header
  console.log(chalk.green(`Loaded and metered compute WASM (simulated).`));

  await delay(2000);
  console.log(chalk.yellow.bold('\n--- ACTION: MINTING PAYMENT TOKEN ---'));
  const paymentToken: TokenState = {
    tokenId: `CREDITS_${client.credentialId.slice(10, 16)}`, type: 'FUNGIBLE',
    ownerCredentialId: client.credentialId,
    metadata: { name: 'Compute Credits', description: 'Tokens for jobs.', amount: 100 }
  };
  const mintEvent: CUE_Event = { type: 'MINT_TOKEN', level: 'GLOBAL', payload: paymentToken, timestamp: Date.now() };
  await client.broadcast(mintEvent);

  await delay(3000);
  console.log(chalk.yellow.bold('\n--- ACTION: REQUESTING COMPUTE JOB ---'));
  const computeEvent: CUE_Event = {
    type: 'COMPUTE_REQUEST', level: 'GROUP',
    payload: {
      jobId: `JOB_WASM_${client.credentialId.slice(10, 16)}`,
      meteredWasmBinary: Array.from(meteredWasmBinary),
      functionName: 'sum', inputData: [ [10, 20, 30, 40] ],
      gasLimit: 1_000_000, requestedCapabilities: [],
      paymentOffer: { tokenId: paymentToken.tokenId, amount: 20 }
    },
    timestamp: Date.now()
  };
  await client.broadcast(computeEvent);
  console.log(chalk.green('\nClient finished. Listening for network events...'));
}
main();