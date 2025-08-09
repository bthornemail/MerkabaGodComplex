import Verttheory from "./vert.theory";
import { start } from "live-server";

var params = {
// port: 8181, // Set the server port. Defaults to 8080.
host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
root: "public/", // Set root directory that's being served. Defaults to cwd.
open: false, // When false, it won't load your browser by default.
// ignore: 'scss,my/templates', // comma-separated string for paths to ignore
file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
// wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
// mount: [['/', './public']], // Mount a directory to a route.
// logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
// middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack,
   "proxy":[["/","http://localhost:40000/"]]
};
start(params);

// const socket = io("http://127.0.0.1:40000");
// // client-side
// socket.on("connect", () => {
//     socket.emit("post-service-announcement", {
//         title: "string",
//         summary: "string",
//         description: "string",
//         images: ["string"],
//         tags: ["string"],
//         keywords: ["string"]
//     })
// });
// socket.on("members", (members) => {
//     console.log(members); // undefined
// })
// socket.on("services", (services) => {
//     console.log(services); // undefined
// })
// socket.on("disconnect", () => {
//     console.log(socket.id); // undefined
// });