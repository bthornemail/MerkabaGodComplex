import SilentWritable from './Silent.Writable.js'
import * as readline from 'readline'

export interface CLI_INTERFACE_OPTIONS extends readline.ReadLineOptions {
  output: SilentWritable
}

export type CLI_INTERFACE = readline.Interface

const cliInterface: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: new SilentWritable()
})
export default cliInterface
