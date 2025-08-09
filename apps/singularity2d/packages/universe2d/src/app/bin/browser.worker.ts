export class BrowserWorker {
    private worker: Worker;
    private listeners: { [key: string]: Function } = {};
    private defaultListener: (data: any) => void;

    constructor(script: string | URL, defaultListener?: (data: any) => void, onError?: (err: any) => void) {
        this.defaultListener = defaultListener ?? (() => { });
        this.worker = new Worker(script, { type: "module" });
        if (onError) {
            this.worker.onerror = onError;
        }

        this.worker.onmessage = (event: MessageEvent) => {
            const { queryMethodListener, queryMethodArguments } = event.data;
            if (queryMethodListener && this.listeners[queryMethodListener]) {
                this.listeners[queryMethodListener](...queryMethodArguments);
            } else {
                this.defaultListener(event.data);
            }
        };
    }

    sendQuery(queryMethod: string, ...args: any[]) {
        this.worker.postMessage({ queryMethod, queryMethodArguments: args });
    }

    addListener(name: string, listener: (...args: any[]) => void) {
        this.listeners[name] = listener;
    }

    removeListener(name: string) {
        delete this.listeners[name];
    }

    terminate() {
        this.worker.terminate();
    }
}
