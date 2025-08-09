// eslint-disable-next-line etc/prefer-interface
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
import { multiaddr } from '@multiformats/multiaddr';
import { Wallet } from 'ethers';
import { readFileSync } from 'fs';
import * as readline from 'readline';
import stream from 'stream';
import { connect, MqttClient, IPublishPacket } from "mqtt";
// import figlet from 'figlet';
import { bright, blue, reset, yellow } from '../bin/console/console.colors';
import { formatMD } from '..';
import frontMatter from "front-matter";

export class SilentWritable extends stream.Writable {
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

export const cliInterface: readline.Interface = readline.createInterface({
	input: process.stdin,
	output: new SilentWritable()
})

export abstract class BASE_CLI {
	name: string
	client: MqttClient
	wallet: Wallet
	multiaddr: string
	roles: string[] = [
		'admin',
		'delegate',
		'guest',
		'me',
		'you',
		'observer',
		'teacher',
		'http',
		'ws',
		'mqtt'
	]
	constructor(privateKey: any = new Wallet(readFileSync('../../bin/keys/admin.key', 'utf-8'))) {
		// this.roles.forEach((key)=>console.log(`export VAULT_AI_PRIVATE_KEY_${key.toUpperCase()}=${readFileSync(`./keys/${key}.key`,'utf-8')}`))
		// this.roles.forEach((key)=>writeFileSync(`./keys/${key}.key`,Wallet.createRandom().privateKey))
		const wallet = this.wallet = new Wallet(privateKey)
		const address = 'http://127.0.0.1:8080'
		// new Multiaddr('/ip4/192.168.0.13/tcp/80')

		this.multiaddr = `${address}/${wallet.address}`
		const addr = multiaddr(`/ip4/127.0.0.1/tcp/8080`)
		//console.log('privateKey',wallet.privateKey)
		this.name = this.wallet.address
		//console.log('address',wallet.address)
		let client = this.client = connect("mqtt://life2d.com", {
			port: 1883,
			wsOptions: {
				port: 3883
			},
			// port: 1883,
			// servername: 'vault-ai',
			username: addr.getPeerId()!,//addr.toString(), 	
			// password: 
			clientId: wallet.address
		})
		// console.log(client.options.clientId)
		client.on('connect', (data: any) => {
			// console.log("Connected",data)
			client.subscribe("public", (err: any) => {
				if (err) { console.log("error", err) }
			})

		})
		client.on('message', async (topic: any, message: any, packet: IPublishPacket) => {
			console.log({ topic }, { message: new TextDecoder().decode(message) })
			console.log({ packet }, packet.messageId, packet.properties)
			await this.onMessage(topic, message)
		})
	}
	send(username: string, topic: string, message: string): void {
		this.client.publish(topic, `${username}: ${message}`)
	}

	async onTopic(topic: string) {
		console.log(`Welcome to ${topic} server`)
		this.client.subscribe(topic, (err: any) => {
			if (err) { console.log("error", err) }
		})
		return
	}

	async onMessage(topic: string, message: string) {
		console.log(`topic: ${topic}`)
		console.log('message', message)
	}
	async onCommand(line: string) {
		try {
			if (line.startsWith("./")) {
				console.log(`Enter ./"command" with command below`)
				console.log("Commands", `${"login"}`)
				return
			}
			if (line.startsWith("?")) {
				console.log(`Enter ./"command" with command below`)
				console.log("Commands", `${"login"}`)
				return
			}
			if (line.split("/")[1]) {
				const topic = line.split("/")[1].split(" ")[0]
				return await this.onTopic(topic)
			}
		}
		catch (err: any) {
			console.log(err)
		}
	}

}
type CLI_PARAMS = { identity?: string }
const intro = frontMatter(`---
?: "this help page"
./: "get local commnd"
./login: "login user"

---

${"Welcome to Unity2D CLI"}
`);
export default class CLI extends BASE_CLI {
	identity: string;
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
	constructor({ identity }: CLI_PARAMS) {
		super(Wallet.createRandom().privateKey)
		// super(Wallet.createRandom().privateKey)
		// showMenu({ title: "MQTT", summary: this.wallet.address, alert: this.wallet.privateKey })
		this.identity = identity ?? "unity2D";
		this.rl = cliInterface
	}
	async start() {
		console.clear();
		console.log(`${bright}${blue}${intro.body}${reset}`)
		console.log("---")
		console.log(intro.frontmatter)
		console.log("\n---\n")
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.rl.on('line', async (line: string) => {
			line = line.trim()
			try {
				await this.onLine(line)
				if (this.username) {
					await this.onLogin(line)
					this.rl.setPrompt(`${yellow}${this.username}${reset}: `)
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

						this.rl.setPrompt(`${yellow}${this.username}${reset}: `)
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
			this.rl.setPrompt(`${yellow}${this.name}${reset}: `)
			this.rl.prompt()
		})
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.rl.on('close', async (line: string) => {
			console.log(`${this.name}: Goodbye!!!`)
			await this.start()
		})
		this.rl.setPrompt(`${yellow}${this.identity}${reset}: `)
		this.rl.prompt()
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

				this.rl.setPrompt(`${yellow}${this.username}${reset}: `)
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

					this.rl.setPrompt(`${yellow}${this.username}${reset}: `)
					return this.rl.prompt()
				}
			}
		}
		catch (err: any) {
			console.log(err)
		}

	}

}


export class NEW_CLI {
	identity: string;
	name: string
	client: MqttClient
	wallet: Wallet
	multiaddr: string
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
	constructor({ identity }: CLI_PARAMS) {
		// super(Wallet.createRandom().privateKey)
		// showMenu({ title: "MQTT", summary: this.wallet.address, alert: this.wallet.privateKey })
		const wallet = this.wallet = new Wallet(Wallet.createRandom().privateKey)
		const address = 'http://127.0.0.1:8080'
		// new Multiaddr('/ip4/192.168.0.13/tcp/80')

		this.multiaddr = `${address}/${wallet.address}`
		const addr = multiaddr(`/ip4/127.0.0.1/tcp/8080`)
		//console.log('privateKey',wallet.privateKey)
		this.name = this.wallet.address
		this.identity = identity ?? "unity2D";
		this.rl = cliInterface
	}
	async start() {
		console.clear();
		console.log(`${bright}${blue}${intro.body}${reset}`)
		console.log("---")
		console.log(intro.frontmatter)
		console.log("\n---\n")
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.rl.on('line', async (line: string) => {
			line = line.trim()
			try {
				await this.onLine(line)
				// if (this.username) {
				// 	await this.onLogin(line)
				// 	this.rl.setPrompt(`${yellow}${this.username}${reset}: `)
				// 	return this.rl.prompt()
				// }
				// this.send(this.name, "public", line)
				if (this.rl.getPrompt().split(':')[0] === 'Enter Token') {
					if (!this.username) throw Error("No Username")
					if (!this.users[this.username]) throw Error("User Doesn't Exist")
					if (line !== "0000") {
						console.log("Wrong Password")
						return this.rl.prompt()
					}

					if (line === this.users[this.username].token) {
						console.log("Login Successful")

						this.rl.setPrompt(`${yellow}${this.username}${reset}: `)
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
			this.rl.setPrompt(`${yellow}${this.name}${reset}: `)
			this.rl.prompt()
		})
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.rl.on('close', async (line: string) => {
			console.log(`${this.name}: Goodbye!!!`)
			await this.start()
		})
		this.rl.setPrompt(`${yellow}${this.identity}${reset}: `)
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
}