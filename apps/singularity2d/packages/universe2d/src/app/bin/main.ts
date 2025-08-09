import { BrowserWorker } from './browser.worker';

const myTask = new BrowserWorker('/dist/app/bin/query-worker.js');
// const myTask = new BrowserWorker(readFileSync(join(import.meta.dirname,"../../../dist/app/bin/query-worker.js"),"utf-8"));

myTask.addListener("printStuff", (result) => {
    console.log(`The difference is ${result}!`);
});

myTask.addListener("doAlert", (time, unit) => {
    console.log(`Worker waited for ${time} ${unit} :-)`);
});

myTask.sendQuery('getDifference', 10, 4); // Logs: "The difference is 6!"
myTask.sendQuery('waitSomeTime'); // Logs after 3s: "Worker waited for 3 seconds :-)"
