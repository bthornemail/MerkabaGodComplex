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