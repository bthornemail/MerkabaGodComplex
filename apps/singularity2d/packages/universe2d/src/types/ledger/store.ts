/*
need to make content graph,for graphs as context, 
and asset store 
and a service chain 
with a graph to map the context 
*/
import { ASSET } from './asset';
import { CONTEXT } from './context';
import { IDENTITY } from './identity';
export type STORE = {
    extendedKey: string;
    contexts: STORE_CONTEXT[];
}
export type STORE_CONTEXT = {
    extendedKey: string;
    timestamp?: string;
} & CONTEXT & ASSET;
export interface iStore {
    add(context: STORE_CONTEXT): void | Promise<void>;
    get(context: STORE_CONTEXT): STORE_CONTEXT | Promise<STORE_CONTEXT>;
    export(context: STORE_CONTEXT): STORE | Promise<STORE>;
    import(history: STORE): void | Promise<void>;
};
export abstract class BaseStore implements iStore { 
    protected abstract extendedKey: string;
    protected abstract contexts: STORE_CONTEXT[];
    abstract add(context: STORE_CONTEXT): void
    abstract get(context: STORE_CONTEXT): STORE_CONTEXT | Promise<STORE_CONTEXT>;
    // Get the latest block in the chain
    abstract export(context: STORE_CONTEXT): STORE
    abstract import(history: STORE): void
}
export abstract class StoreStore extends BaseStore {
    extendedKey: string;
    contexts: STORE_CONTEXT[];
    constructor(rootContext: IDENTITY, history?: STORE) {
        super();
        this.extendedKey = rootContext.extendedKey;
        this.contexts = history ? history.contexts : [];
    }
    add(context: STORE_CONTEXT) {
        // if (this.isNodeValid(node)) throw new Error("Node Fingerprint Not Valid");
        // if (this.nodes.filter(node => node.extendedKey === node.extendedKey).length > 0) throw Error("Node Exist");
        this.contexts.push(context);
    }
    get(context: STORE_CONTEXT): STORE_CONTEXT | Promise<STORE_CONTEXT> {
        for (const data of this.contexts) {
            Object.entries(context).forEach(([key, value]) => {
                if (data[key] === context[key])
                    return data[key] === value;
            })
        };
        throw new Error("Not Found");  
    }
    export(context: STORE_CONTEXT): STORE {
        return {
            extendedKey: this.extendedKey,
            contexts: this.contexts.map(node => Object.assign({},node)),
        }
    }
    import(history: STORE) {
        history.contexts.forEach((context: STORE_CONTEXT) => this.add(context))
    }
}
export default class Store extends StoreStore {
    constructor(rootNode: IDENTITY, history?: STORE) {
        super(rootNode, history);
        this.extendedKey = rootNode.extendedKey;
        this.contexts = history ? history.contexts : [];
    }
    // async *build(getLink?: (link: string) => Promise<Node>): AsyncGenerator<Node, number, void> {
    //     if (getLink) {
    //         for (const node of this.contexts) {
    //             // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
    //             yield await getLink(node.extendedKey)//.catch(()=>new Node({content:"text/plain;message=string",title:"Not Found"}));
    //         };
    //         // throw new Error("Node not found");
    //     } else {
    //         for (const node of this.contexts) {
    //             // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate data availability every 5 seconds
    //             yield new Node(node);
    //         };
    //     }
    //     return 1;
    // }
}