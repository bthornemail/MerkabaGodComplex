/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
import { blink, blue, bright, red, reset, white, yellow } from './bin/console.colors.js'
// // import { AddressLike, HDNodeWallet, Wallet, ethers } from 'ethers';
// import { Worker } from 'worker_threads'
// import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
// import { CID } from 'multiformats/cid'
// import * as vm from 'node:vm'
// import { Multiaddr } from '@multiformats/multiaddr'
// import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
// import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
// import __get_dirname from '../../utils/__dirname.js'
// import { VM_SCRIPT_FUNCTION_PARAMETERS } from './VM.Node.js'
import { BlockNode, MENU_OPTION, NODE_OPTIONS, START_MENU_PROPS } from './types/Vault.AI.types.js'
// import SilentWritable from './Silent.Writable.js'
import * as readline from 'readline'
import stream from 'stream'
import { connect, MqttClient } from "mqtt" // import connect from mqtt
import showMenu from './bin/show.menu.js'
import MQTTSystem from './MQTT.System.js'

class SilentWritable extends stream.Writable {
	_write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
		if (!/^[\r\n]+$/.test(chunk)) {
			process.stdout.write(chunk, encoding)
		}
		callback()
	}
}

export interface CLI_INTERFACE_OPTIONS extends readline.ReadLineOptions {
	output: SilentWritable
}

export type CLI_INTERFACE = readline.Interface

const cliInterface: readline.Interface = readline.createInterface({
	input: process.stdin,
	output: new SilentWritable()
})
export default class CLINode extends MQTTSystem {
	rl: CLI_INTERFACE
	username?: string
	users: Record<string, any> = {
		me: {
			token: "0000",
			username: "me"
		}
		, you: {
			token: "0000",
			username: "you"
		}
	}
	constructor() {
		super()
		// showMenu({ title: "MQTT", summary: this.wallet.address, alert: this.wallet.privateKey })
		this.rl = cliInterface
	}
	async onMessage(topic: string, message: string) {
		this.rl.setPrompt(`${topic}: `)
		this.rl.prompt()
		this.rl.setPrompt(`${topic}: `)
	}
	async onTopic(topic: string) {
		await super.onTopic(topic)
		this.rl.setPrompt(`${topic}: `)
		return this.rl.prompt()
	}
	async onLogin(line: string) {
		if (this.username) {
			if (!this.users[this.username]) throw Error("User Doesn't Exist")
			if (line !== "0000") {
				console.log("Wrong Password")
				return this.rl.prompt()
			}

			if (line === this.users[this.username].token) {
				console.log("Login Successful")

				this.rl.setPrompt(`${this.username}: `)
				return this.rl.prompt()
			}
		}
		this.rl.question("Enter Username: ", async (answer: string) => {
			this.username = answer.trim()

			console.log(`${this.multiaddr}/login?token=${await this.wallet.signMessage(answer)}&username=${this.username}`)
			this.rl.setPrompt("Enter Token: ")
			return this.rl.prompt()
		})
	}
	async start() {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.rl.on('line', async (line: string) => {
			line = line.trim()
			try {
				await this.onLine(line)
				if (this.username) {
					await this.onLogin(line)
					this.rl.setPrompt(`${this.username}: `)
					return this.rl.prompt()
				}
				this.send(this.name, "public", line)
				if (this.rl.getPrompt().split(':')[0] === 'Enter Token') {
					if (!this.username) throw Error("No Username")
					if (!this.users[this.username]) throw Error("User Doesn't Exist")
					if (line !== "0000") {
						console.log("Wrong Password")
						return this.rl.prompt()
					}

					if (line === this.users[this.username].token) {
						console.log("Login Successful")

						this.rl.setPrompt(`${this.username}: `)
						return this.rl.prompt()
					}
				}
				if (line.startsWith("./")) {
					if (line.startsWith("./login")) {
						this.rl.question("Enter Username: ", async (answer: string) => {
							this.username = answer.trim()

							console.log(`${this.multiaddr}/login?token=${await this.wallet.signMessage(answer)}&username=${this.username}`)
							this.rl.setPrompt("Enter Token: ")
							return this.rl.prompt()
						})
					}
				}
				if (line.split("/")[1]) {
					const topic = line.split("/")[1].split(" ")[0]
					this.client.subscribe(topic, (err: any) => {
						if (err) { console.log("error", err) }
					})
					console.log(`Welcome to ${topic} server`)
					this.rl.setPrompt(`${topic}: `)
					return this.rl.prompt()
				}
			}
			catch (err: any) {
				console.log(err)
			}
			this.rl.setPrompt(`${this.name}: `)
			this.rl.prompt()
		})
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.rl.on('close', async (line: string) => {
			console.log(`${this.name}: Goodbye!!!`)
			await this.start()
		})
		this.rl.setPrompt(`${this.name}: `)
		this.rl.prompt()
	}

	async onLine(line: string): Promise<void> {
		try {
			if (line.split("/")[1]) {
				const command = line.split("/")[1].split(" ")[0]
				this.rl.setPrompt(`${command}: `)
				return this.rl.prompt()
			}
			if (this.rl.getPrompt().split(':')[0] !== this.name) {
				const topic = this.rl.getPrompt().split(":")[0];
				this.client.publish(topic, `${this.username}: ${line}`)
				this.rl.setPrompt(`${topic}: `)
				return this.rl.prompt()
			}
			this.client.publish("public", `${line}`)
		}
		catch (err: any) {
			console.log(err)
		}
	}
	async onCommand(line: string): Promise<any> {
		await super.onCommand(line)
		try {
			if (line.startsWith("./login")) {
				await this.onLogin(line)
			}
			if (this.rl.getPrompt().split(':')[0] === 'Enter Token') {
				if (!this.username) throw Error("No Username")
				if (!this.users[this.username]) throw Error("User Doesn't Exist")
				if (line !== "0000") {
					console.log("Wrong Password")
					return this.rl.prompt()
				}

				if (line === this.users[this.username].token) {
					console.log("Login Successful")

					this.rl.setPrompt(`${this.username}: `)
					return this.rl.prompt()
				}
			}
		}
		catch (err: any) {
			console.log(err)
		}

	}

}
