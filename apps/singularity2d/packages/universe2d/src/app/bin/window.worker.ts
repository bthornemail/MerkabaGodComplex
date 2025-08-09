export class WindowWorker {
     swController: ServiceWorkerContainer | null = navigator.serviceWorker;
    private listeners: Record<string, Function> = {};
    private defaultListener: (data: any) => void;

    
    constructor(script: string, defaultListener?: (data: any) => void) {
        if (this.swController) {
            navigator.serviceWorker.register(script).then(() => {
                console.log("Service Worker registered!");
            });
        }
        this.defaultListener = defaultListener ?? (() => {});
        navigator.serviceWorker.addEventListener("message", (event) => {
            const { response } = event.data;
            this.defaultListener(response);
        });
    }

    sendQuery(queryMethod: string, ...args: any[]) {
        this.swController?.controller?.postMessage({ queryMethod, queryMethodArguments: args });
    }

    chatWithOllama(prompt: string) {
        this.swController?.controller?.postMessage({ chatPrompt: prompt });
    }

    addListener(name: string, listener: (...args: any[]) => void) {
        this.listeners[name] = listener;
    }

    removeListener(name: string) {
        delete this.listeners[name];
    }

    // terminate() {
    //     this.swController?.controller?;
    // }
}
