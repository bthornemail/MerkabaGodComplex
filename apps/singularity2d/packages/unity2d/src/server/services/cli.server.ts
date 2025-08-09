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
// import { formatMD } from '..';
import frontMatter from "front-matter";

export class SilentWritable extends stream.Writable {
	_write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
		if (!/^[\r\n]+$/.test(chunk)) {
			process.stdout.write(chunk, encoding)
		}
		callback()
	}
}
export class MQTTWritable extends stream.Writable {
	client: MqttClient;
	_write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
		if (!/^[\r\n]+$/.test(chunk)) {
			process.stdout.write(chunk, encoding)
		}
		callback()
	}
	constructor() {
		super();
		let client = this.client = connect("mqtt://127.0.0.1", {
			port: 1883,
			wsOptions: {
				port: 3883
			},
			// port: 1883,
			// servername: 'vault-ai',
			// username: addr.getPeerId()!,//addr.toString(), 	
			// password: 
			// clientId: wallet.address
		})
		// console.log(client.options.clientId)
		client.on('connect', (data: any) => {
			// console.log("Connected",data)
			client.subscribe("topic", (err: any) => {
				if (err) { console.log("error", err) }
			})

		})
		client.on('message', async (topic: any, message: any, packet: IPublishPacket) => {
			// console.log({ topic }, { message: new TextDecoder().decode(message) })
			// console.log({ packet }, packet.messageId, packet.properties)

			this.write(frontMatter(`---
topic: ${topic}
message: ${message}

---

${message}
`).body)
		})
	}
}

export type CLI_INTERFACE = readline.Interface

export const cliInterface: readline.Interface = readline.createInterface({
	input: process.stdin,
	output: new MQTTWritable()
})
type CLI_PARAMS = { identity?: string }
const intro = frontMatter(`---
?: "this help page"
./: "get local commnd"
./login: "login user"

---

${"Welcome to Unity2D CLI"}
`);

export default class CLI {
	prompt: string = `${bright}${blue}${"enter path: "}${reset}`;
	topic: string = "0x";
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

		let client =  connect("mqtt://127.0.0.1", {
			port: 1883,
			wsOptions: {
				port: 3883
			},
			// port: 1883,
			// servername: 'vault-ai',
			// username: addr.getPeerId()!,//addr.toString(), 	
			// password: 
			// clientId: wallet.address
		})
		// console.log(client.options.clientId)
		client.on('connect', () => {
			this.client = client;

		})
		client.on('message', async (topic: any, message: any, packet: IPublishPacket) => {
			// console.log({ topic }, { message: new TextDecoder().decode(message) })
			// console.log({ packet }, packet.messageId, packet.properties)

			this.rl.write(frontMatter(`---
topic: ${topic}
message: ${message}

---

${message}
`).body)
		})
	}
	async start() {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.rl.on('line', async (line: string) => {
			line = line.trim()
			await this.onLine(line);
			// try {
			// 	if (line.startsWith("?")) {
			// 		console.log(intro.frontmatter!)
			// 	}
			// }
			// catch (err: any) {
			// 	console.log(err)
			// }
			this.prompt = `\n${yellow}${this.identity}${reset}: `
			this.rl.setPrompt(this.prompt)
			this.rl.prompt()
		})
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		this.rl.on('close', async (line: string) => {
			console.log(`${this.identity}: Goodbye!!!`)
			await this.start()
		})
		console.clear();
		console.log(`${bright}${blue}${intro.body}${reset}`)
		console.log("---")
		console.log(intro.frontmatter)
		console.log("\n---\n")

		await this.client?.subscribeAsync(this.topic)

		this.rl.setPrompt(this.prompt)
		this.rl.prompt()
	}
	async onLine(line: string) {
		try {
			if (line.startsWith("?")) {
				console.log("\n", intro.frontmatter!, "\n")
				return;
			}
			if (line.endsWith("/")) {
				// const steps = line.split("/");
				// console.log(steps!)
				this.topic = line;
				return;
			}
			await this.client.publishAsync(this.topic, line)
		}
		catch (err: any) {
			console.log(err)
		}
	}
}