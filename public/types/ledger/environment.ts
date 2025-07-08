import { Worker } from 'worker_threads'
import EventEmitter from "node:events";
import { SIGNER } from './signer';
import { VAULT } from "./vault";
import { iEmit, iRegisterEvents } from "./event.register";
export type BASE_ENVRONMENT = {
    signer: SIGNER;
    vault: VAULT;
}
export type ENVRONMENT = {
    eventListeners: { [event: string]: Array<(...args: any[]) => void> };
} & BASE_ENVRONMENT;
export abstract class BaseEnvironment implements iRegisterEvents {
    protected abstract signer: SIGNER;
    protected abstract vault: VAULT;
    protected abstract eventListeners: { [event: string]: Array<(...args: any[]) => void> }

    on(event: string, listener: (...args: any[]) => void) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(listener);
    }
    emit(event: string, ...args: any[]) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(listener => listener(...args));
        }
    }
}
export default class Environment extends BaseEnvironment {
    protected signer: SIGNER;
    protected vault: VAULT;
    protected eventListeners: { [event: string]: Array<(...args: any[]) => void> } = {};
    async *generate(init: Record<string, any>): AsyncGenerator<(data: Record<string, any>) => Promise<void>, Record<string, any>, void> {
        // const protocol = this.protocols[Math.floor(Math.random() * this.protocols.length)];
        const getIdentity = async (data: Record<string, any>) => {
            return;
        }
        yield getIdentity;
        const getClient = async (data: Record<string, any>) => {
            return;
        }
        yield getClient;
        const getConnection = async (data: Record<string, any>) => {
            return;
        }
        yield getConnection;
        const getPeer = async (data: Record<string, any>) => {
            return;
        }
        yield getPeer;
        const getConsumer = async (data: Record<string, any>) => {
            return;
        }
        yield getConsumer;
        const getDelegate = async (data: Record<string, any>) => {
            return;
        }
        yield getDelegate;
        const getEscrow = async (data: Record<string, any>) => {
            return;
        }
        yield getEscrow;
        const getHost = async (data: Record<string, any>) => {
            return;
        }
        yield getHost;
        const getProvider = async (data: Record<string, any>) => {
            return;
        }
        yield getProvider;
        const getSigner = async (data: Record<string, any>) => {
            return;
        }
        yield getSigner;
        const getWorker = async (data: Record<string, any>) => {
            return;
        }
        yield getWorker;
        return {
            record: this.vault.memory.record,
            definitions: this.vault.memory.definitions,
            state: this.vault.memory.state
        }
    }
}
export class WorkerEnvironment extends Environment {
    worker: Worker; // manages connections
    async connect(worker: string, data: string) {
        this.worker = new Worker(worker, {
            eval: true,
            workerData: this.vault
        });

        this.worker.on("online", () => {
            console.log("Online");
            this.worker?.postMessage({ extendedKey: this.signer.extendedKey, data })
        })
        // Add event listener to receive messages from the worker
        this.worker.on('message', (event: any) => {
            console.log(`Message received from worker:\n`, event);
        });

    }
}