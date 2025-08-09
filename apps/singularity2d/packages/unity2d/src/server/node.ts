import cluster from 'node:cluster';
import http from 'node:http';
import process from 'node:process';
import { availableParallelism } from 'node:os';
import jsdom from "jsdom";
const { JSDOM } = jsdom;
const resourceLoader = new jsdom.ResourceLoader({
  proxy: "http://127.0.0.1:8888",
  strictSSL: false,
  userAgent: "Vault2D/8001",
});
// for each hs a different virtual concolse to exporttheir own errors sepaaretyly
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {  });
virtualConsole.on("warn", () => {  });
virtualConsole.on("info", () => {  });
virtualConsole.on("dir", () => { });
// virtualConsole.sendTo(c, { omitJSDOMErrors: true }); // to hanle myselef withoout errors in index[0]

JSDOM.fromFile("./client/Vault2D/index.html", {
  url: "client/Vault2D/",
  referrer: "https://vault2d.com",
  contentType: "text/html",
  includeNodeLocations: true,
  // storageQuota: 10000000,
  runScripts: "dangerously",
  pretendToBeVisual: true,
  // resources: resourceLoader,
resources: "usable"
  // virtualConsole
}).then(dom => {
  // console.log(dom.serialize());
  console.log(dom.window.document.querySelector("body")!.textContent); // "Hello world"
});

// const dom = new JSDOM(`<body>
//   <div id="content"></div>
//   <script>document.getElementById("content").append(document.createElement("hr"));</script>
// </body>`, { runScripts: "dangerously",resources: "usable" });

// // The script will be executed and modify the DOM:
// console.log(dom.window.document.getElementById("content").children.length); // 1