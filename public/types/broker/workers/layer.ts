import { readFileSync } from 'node:fs';
import { parentPort, workerData } from 'node:worker_threads';
import * as chokidar from 'chokidar';
import MultiGraph from 'graphology';
// Listen for broadcast messages from the manager
parentPort?.on('message', (message) => {
    console.log(`Agent received broadcast: ${message}`);
});

if (workerData.watchFolder) {
    // const files = new Map();
    const graph = new MultiGraph();
    const watcher = chokidar.watch(workerData.watchFolder, {
        // persistent: true,
        // ignoreInitial: true,
        persistent: false,//true,
        ignoreInitial: false,//true,
        ignored: (path: string, stats: any) => {
            if (path.endsWith('.md')) return false;// only watch md files
            if (path.includes('node_modules')) return true;
            return;
        }
    });
    watcher
        .on('add', (path: any) => {
            let file = readFileSync(path, "utf8");
            // files.set(path, file);
            graph.addNode(path, {file});
            parentPort?.postMessage({ event: "add", path, file });
            // console.log(`File added:`, path);//file);
        })
        .on('change', (path: any) => {
            const file = readFileSync(path, "utf8");
            // files.set(path, file);
            graph.setNodeAttribute(path, "file",file);
            parentPort?.postMessage({ event: "change", path, file });
            // console.log(`File changed: ${path}`);
        })
        .on('unlink', (path: any) => {
            // files.delete(path);

            // files.set(path, file);
            graph.dropNode(path);
            parentPort?.postMessage({ event: "delete", path, file: null });
            // console.log(`File removed: ${path}`);
        })
        .on('error', (error: any) => {
            parentPort?.postMessage({ event: "error", error });
            // console.error(`Watcher error: ${error}`);
        });
    // const log = console.log.bind(console);

    watcher
        // .on('addDir', path => log(`Directory ${path} has been added`))
        // .on('unlinkDir', path => log(`Directory ${path} has been removed`))
        // .on('error', error => log(`Watcher error: ${error}`))
        // .on('ready', () => log(`Initial scan of ${workerData.watchFolder} complete. Ready for changes`))
        .on('ready', () => parentPort?.postMessage({ event: "ready", graphData: graph.export() }))
        .on('ready', () => parentPort?.postMessage({ event: "message", content: `Initial scan of ${workerData.watchFolder} complete. Ready for changes` }));
        // .on('ready', () => parentPort?.postMessage({ event: "ready", files: Array.from(files) }));
}
