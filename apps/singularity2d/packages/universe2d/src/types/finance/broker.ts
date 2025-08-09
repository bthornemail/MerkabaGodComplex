import { HostWallet } from '../data/data.js';
import { encryptString } from "../bin/pgp.js"
import { HDNodeWallet, HDNodeVoidWallet } from 'ethers';
import { MqttClient } from 'mqtt';
import redis from "../services/redis.js";
import getLink from '../bin/get.link.js';
import getContentString from '../bin/get.content.string.js';
import compileOrder from './order/compile.order.js';
import createOrder from './order/create.order.js';
import submitOrder from './order/submit.order.js';
class Broker {
    client: MqttClient
    signer: HDNodeWallet;
    compile(order: Record<string, string>) {
        compileOrder(this.signer, new Map(Object.entries(order)))
    }
    create(order: Record<string, string>) {
        createOrder(this.signer, new Map(Object.entries(order)))
    }
    submit(orderKey: string) {
        submitOrder(this.client, this.signer, orderKey)
    }

    constructor(client: MqttClient, signer: HDNodeWallet, index = 0) {
        this.client = client;
        this.signer = signer.deriveChild(index);
    }
}