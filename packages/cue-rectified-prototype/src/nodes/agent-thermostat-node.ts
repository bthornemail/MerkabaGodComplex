import { SimplePeer } from '../core/simple-peer';
import { CUE_Event, TemperatureReadingPayload, ThermostatPolicyPayload } from '../common/types';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const BOOTSTRAP_ADDR = "REPLACE_WITH_BOOTSTRAP_ADDRESS";
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log(chalk.bold.magenta('--- Starting CUE Smart Thermostat Agent Node ---'));
  if (BOOTSTRAP_ADDR.includes("REPLACE")) {
    console.error(chalk.red("Please replace BOOTSTRAP_ADDR in the script."));
    process.exit(1);
  }

  const agentPeer = new SimplePeer('./peer-state-thermostat-agent.json');
  await agentPeer.start();

  // Mock agent WASM binary for demo purposes
  const meteredWasm = new Uint8Array([0x00, 0x61, 0x73, 0x6d]); // Mock WASM header
  agentPeer.loadAgentWasm(meteredWasm);

  await delay(2000);

  console.log(chalk.yellow.bold('\n--- ACTION: SETTING AGENT POLICY ---'));
  const policy: ThermostatPolicyPayload = {
    agentId: agentPeer.credentialId, desiredTemperature: 22.0, tolerance: 0.5,
    hvacDeviceId: 'HVAC_001', sensorDeviceId: 'SENSOR_LIVING_ROOM',
  };
  const policyEvent: CUE_Event = {
    type: 'SET_AGENT_POLICY', level: 'GLOBAL',
    payload: policy, timestamp: Date.now(),
  };
  await agentPeer.broadcast(policyEvent);

  await delay(3000);

  console.log(chalk.yellow.bold('\n--- SIMULATING SENSOR READINGS & AGENT AUTONOMY ---'));
  let currentTemp = 23.5;
  setInterval(async () => {
    currentTemp += (Math.random() - 0.5) * 1.5;
    const reading: TemperatureReadingPayload = {
      sensorId: policy.sensorDeviceId, timestamp: Date.now(),
      value: parseFloat(currentTemp.toFixed(1)), unit: 'Celsius',
    };
    const sensorEvent: CUE_Event = {
      type: 'SENSOR_READING', level: 'LOCAL',
      payload: reading, timestamp: Date.now(),
    };
    await agentPeer.broadcast(sensorEvent);
  }, 5000);
}
main();