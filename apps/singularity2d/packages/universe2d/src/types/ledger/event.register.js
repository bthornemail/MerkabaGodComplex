"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEventRegister = void 0;
class BaseEventRegister {
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}
exports.BaseEventRegister = BaseEventRegister;
class EventRegister extends BaseEventRegister {
    constructor() {
        super(...arguments);
        this.events = {};
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}
exports.default = EventRegister;
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
//# sourceMappingURL=event.register.js.map