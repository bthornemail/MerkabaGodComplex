"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.BaseService = void 0;
class BaseService {
    constructor(service) {
        Object.entries(service).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}
exports.BaseService = BaseService;
class Service extends BaseService {
    toJSON() {
        return {
            inputs: this.inputs,
            outputs: this.outputs
        };
    }
    constructor(service) {
        super(service);
        this.load = async () => {
            return 1;
        };
        this.start = async () => {
            return 1;
        };
        this.suspend = async () => {
            return 0;
        };
        this.stop = async () => {
            return 0;
        };
        this.inputs = service.inputs;
        this.outputs = service.outputs;
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map