const ctx: Worker = typeof self !== 'undefined' ? self : require('worker_threads').parentPort;

// Function registry inside the worker
const workerMethods: any = {
    getDifference: (a: number, b: number) => a - b,
    waitSomeTime: () => {
        setTimeout(() => {
            ctx.postMessage({ queryMethodListener: "doAlert", queryMethodArguments: [3, "seconds"] });
        }, 3000);
    }
};

// Handle incoming messages
ctx.onmessage = function(event) {
    const { queryMethod, queryMethodArguments }: { queryMethod: any, queryMethodArguments: any } = event.data;
    if (workerMethods[queryMethod]) {
        const result = workerMethods[queryMethod](...queryMethodArguments);
        // console.log({workerMethods,queryMethod,queryMethodArguments})
        ctx.postMessage({ queryMethodListener: "printStuff", queryMethodArguments: [result] });
    }
};
