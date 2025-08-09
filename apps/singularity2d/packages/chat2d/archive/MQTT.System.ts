/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-console */
import figlet from 'figlet'
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
// import * as readline from 'readline'
import stream from 'stream'
import { connect, IPublishPacket, MqttClient } from "mqtt" // import connect from mqtt
import { writeFileSync } from 'node:fs';

import {
	Wallet,
	verifyMessage
} from "@ethersproject/wallet"
import { readFileSync } from 'fs'
import { multiaddr } from '@multiformats/multiaddr'
// eslint-disable-next-line etc/prefer-interface

export default class MQTTSystem {
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
	constructor(privateKey: any = new Wallet(readFileSync('./keys/admin.key','utf-8'))) {
		// this.roles.forEach((key)=>console.log(`export VAULT_AI_PRIVATE_KEY_${key.toUpperCase()}=${readFileSync(`./keys/${key}.key`,'utf-8')}`))
		// this.roles.forEach((key)=>writeFileSync(`./keys/${key}.key`,Wallet.createRandom().privateKey))
		const wallet = this.wallet = new Wallet(privateKey)
		const address = 'http://127.0.0.1:8080'
		// new Multiaddr('/ip4/192.168.0.13/tcp/80')

		this.multiaddr = `${address}/${wallet.address}`
		const addr =  multiaddr(`/ip4/127.0.0.1/tcp/8080`)
		//console.log('privateKey',wallet.privateKey)
		this.name = this.wallet.address
		//console.log('address',wallet.address)
		let client = this.client = connect("mqtt://life2d.com",{
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
			client.subscribe("public",(err: any) => {
				if (err) { console.log("error", err) }
			})

		})
		client.on('message', async (topic: any, message: any,packet: IPublishPacket) => {
			console.log({topic},{message:new TextDecoder().decode(message)})
			console.log({packet},packet.messageId,packet.properties)
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
		console.log('message',message)
	}
	async onCommand(line: string) {
		try {
			if (line.startsWith("./")) {
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
