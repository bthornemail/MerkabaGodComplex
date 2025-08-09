import getDirName from "./bin/commands/get.dir.name";

import liveServer from "live-server";

var params = {
    // port: 8181, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "/public", // Set root directory that's being served. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    // ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    mount: [
        ['/app', getDirName(import.meta.url, './www/app')],
        ["/car-wash", getDirName(import.meta.url, './www/car-wash')],
        ["/chat", getDirName(import.meta.url, './www/chat')],
        ["/delivery-for-locals", getDirName(import.meta.url, './www/delivery.for.locals')],
        ['/force-graph', getDirName(import.meta.url, './www/force-graph')],
        ["/graph", getDirName(import.meta.url, './www/graph')],
        ["/logistics-hub", getDirName(import.meta.url, './www/logistics-hub')],
        ["/mermaid", getDirName(import.meta.url, './www/mermaid')],
        ["/mqtt", getDirName(import.meta.url, './www/mqtt')],
        ["/helia", getDirName(import.meta.url, './www/helia')],
        ["/service-board", getDirName(import.meta.url, './www/service.board/public')],
        ["/dialpad", getDirName(import.meta.url, './www/dialpad')],
        ["/canvas", getDirName(import.meta.url, './www/canvas')],
        ["/asset", getDirName(import.meta.url, './www/asset')],
        ["/service_board", getDirName(import.meta.url, './www/Service.Board')]
    ], // Mount a directory to a route.
    // logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [function (req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};
liveServer.start(params);


