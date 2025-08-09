import cluster from 'node:cluster';
import http from 'node:http';
import process from 'node:process';
import { availableParallelism } from 'node:os';
import jsdom from "jsdom";
const { JSDOM } = jsdom;
const resourceLoader = new jsdom.ResourceLoader({
  proxy: "http://127.0.0.1:9001",
  strictSSL: false,
  userAgent: "Mellblomenator/9000",
});
// for each hs a different virtual concolse to exporttheir own errors sepaaretyly
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {  });
virtualConsole.on("warn", () => {  });
virtualConsole.on("info", () => {  });
virtualConsole.on("dir", () => { });
// virtualConsole.sendTo(c, { omitJSDOMErrors: true });
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`, {
  url: "https://example.org/",
  referrer: "https://example.com/",
  contentType: "text/html",
  includeNodeLocations: true,
  storageQuota: 10000000,
  runScripts: "dangerously",
  pretendToBeVisual: true,
  resources: resourceLoader,
  // virtualConsole
});
console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
const { window } = new JSDOM(`...`);
// or even
const { document } = (new JSDOM(`...`)).window;
const numCPUs = availableParallelism();
if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`,numCPUs);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork();
        worker.on('listening', (address) => {
            // Worker is listening
            console.log(`worker address ${JSON.stringify(address)} is listening`);
          });

        worker.on('disconnect', () => {
            // Worker has disconnected
            console.log(`worker ${worker.process.pid}  has disconnected`);
        });
        worker.on('exit', (code, signal) => {
            if (signal) {
              console.log(`worker was killed by signal: ${signal}`);
            } else if (code !== 0) {
              console.log(`worker exited with error code: ${code}`);
            } else {
              console.log('worker success!');
            }
          });
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(8000);

    console.log(`Worker ${process.pid} started`);
}