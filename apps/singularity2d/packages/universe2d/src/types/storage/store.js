"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreStore = exports.BaseStore = void 0;
;
class BaseStore {
}
exports.BaseStore = BaseStore;
class StoreStore extends BaseStore {
    constructor(rootContext, history) {
        super();
        this.extendedKey = rootContext.extendedKey;
        this.contexts = history ? history.contexts : [];
    }
    add(context) {
        // if (this.isNodeValid(node)) throw new Error("Node Fingerprint Not Valid");
        // if (this.nodes.filter(node => node.extendedKey === node.extendedKey).length > 0) throw Error("Node Exist");
        this.contexts.push(context);
    }
    get(context) {
        for (const data of this.contexts) {
            Object.entries(context).forEach(([key, value]) => {
                if (data[key] === context[key])
                    return data[key] === value;
            });
        }
        ;
        throw new Error("Not Found");
    }
    export(context) {
        return {
            extendedKey: this.extendedKey,
            contexts: this.contexts.map(node => Object.assign({}, node)),
        };
    }
    import(history) {
        history.contexts.forEach((context) => this.add(context));
    }
}
exports.StoreStore = StoreStore;
class Store extends StoreStore {
    constructor(rootNode, history) {
        super(rootNode, history);
        this.extendedKey = rootNode.extendedKey;
        this.contexts = history ? history.contexts : [];
    }
}
exports.default = Store;
//# sourceMappingURL=store.js.map