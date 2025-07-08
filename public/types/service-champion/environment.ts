import EventEmitter from "node:events";

export interface iEmit {
    on(event: string, listener: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
}
class Environment implements iEmit {
    
    private eventEmitter: EventEmitter;
    protected eventListeners: { [event: string]: Array<(...args: any[]) => void> } = {};

    // on(event: string, listener: (...args: any[]) => void) {
    //     if (!this.eventListeners[event]) {
    //         this.eventListeners[event] = [];
    //     }
    //     this.eventListeners[event].push(listener);
    // }
    on(event: string, listener: (...args: any[]) => void) {
        this.eventEmitter.on(event, listener);
    }

    emit(event: string, data: any) {
        this.eventEmitter.emit(event, data);
    }

    // protected emit(event: string, ...args: any[]) {
    //     if (this.eventListeners[event]) {
    //         this.eventListeners[event].forEach(listener => listener(...args));
    //     }
    // }
}

export default Environment;
