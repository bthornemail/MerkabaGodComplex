import { HDNodeWallet } from "ethers";
import EventEmitter from "node:events";
import { UrlObject } from "url";

export type CONNECTION = {
    extendedKey: string;
} & UrlObject;
export class Connection {
    extendedKey: string;
    eventEmitter: EventEmitter;

    on(event: string, listener: (...args: any[]) => void) {
        this.eventEmitter.on(event, listener);
    }
    emit(event: string, data: any) {
        this.eventEmitter.emit(event, data);
    }
    constructor(connection: CONNECTION) {
        Object.assign(this, connection, HDNodeWallet.fromExtendedKey(connection["extendedKey"]))
    }
}