type EventCallback = (data?: any) => void;


export interface iEmit {
    on(event: string, listener: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
}
export interface iRegisterEvents {
    on(event: string, listener: EventCallback): void

    emit(event: string, data?: any): void

}
export abstract class BaseEventRegister implements iRegisterEvents {
    abstract events: { [key: string]: EventCallback[] };
    on(event: string, listener: EventCallback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event: string, data?: any) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}
export default class EventRegister extends BaseEventRegister {
    events: { [key: string]: EventCallback[] } = {};

    on(event: string, listener: EventCallback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event: string, data?: any) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}
// EventRegister.prototype.emit("marketplace:peer-id", null)
// EventRegister.prototype.emit("marketplace:multiaddr", null);
// EventRegister.prototype.on("register:asset", async () => { });
// EventRegister.prototype.on("register:service", async () => { });
// EventRegister.prototype.on("register:course", async () => { });
// EventRegister.prototype.on("register:exam", async () => { });
// EventRegister.prototype.on("register:task", async () => { });
// EventRegister.prototype.on("register:test", async () => { });
// EventRegister.prototype.on("get:asset", async () => { });
// EventRegister.prototype.on("get:service", async () => { });
// EventRegister.prototype.on("get:course", async () => { });
// EventRegister.prototype.on("connect", async () => {})
