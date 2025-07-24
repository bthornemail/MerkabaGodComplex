import * as mqtt from 'mqtt';
import * as chokidar from 'chokidar';
import { join } from 'path';
import express, { Request, Response } from "express";
import { readFileSync } from 'fs';
// import getAllFilesInDirectory from "../../unity2d/bin/commands/get.all.files";
// import getDirName from "../../unity2d/bin/commands/get.dir.name";
// import { decryptKeystoreJsonSync, HDNodeWallet, Mnemonic, SigningKey } from "ethers";
import MultiGraph from 'graphology';
import frontMatter from "front-matter";
import { MerkleTree } from "merkletreejs";
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from "datastore-core";
import { Key } from 'interface-datastore';
// MQTT Configuration
const MQTT_BROKER_URL = 'mqtt://localhost:1883'; // Update with your broker URL
const MQTT_TOPIC = 'file/changes';
const identity = "obsidian-watcher"
// Folder to watch
const WATCH_FOLDER = 'docs/Bots'; // Update with your folder path

const protocol = "ws";
const host = "127.0.0.1";
let port = 8011;
const merkleTree = new MerkleTree([]);
const graph = new MultiGraph();
const dht = new MemoryDatastore();
const chain = new MemoryBlockstore();

// .on('raw', (event, path, details) => { // internal
// log('Raw event info:', event, path, details);
// });

// Connect to the MQTT broker
const client = mqtt.connect(MQTT_BROKER_URL);
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use((req: Request, res: Response, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next) => {
    if (req.path.startsWith("/obsidian")) return next();
    res.sendStatus(404);
    console.log("req.path", req.path)
    client.publish(`get/${req.path}`, JSON.stringify({ event: 'change' }));
});

app.use("/obsidian", express.static(join(import.meta.dirname, "./public/monitor")));

app.listen(port, () => {
    console.log(`${identity}: HTTP Server on http://${host}:${port}`);
//     console.log(`${bright}${blue}${identity}${reset}: HTTP Server on http://${host}:${port}`);
//     console.log(`${bright}${blue}${identity}${reset}: Get specfied identity @ http://${host}:${port}/:identity`);
//     console.log(`${bright}${blue}${identity}${reset}: specfied identity from context @ http://${host}:${port}/:context/:identity`);
//     console.log(`${bright}${blue}${identity}${reset}: Set specfied identity @ http://${host}:${port}/:identity`);
//     console.log(`${bright}${blue}${identity}${reset}: Set specfied identity to context @ http://${host}:${port}/:context/:identity`);
})
client.on('connect', () => {    
    console.log(`Connected to MQTT broker at ${MQTT_BROKER_URL}`);


    // Watch for file changes
    const watcher = chokidar.watch(WATCH_FOLDER, {
        persistent: false,//true,
        ignoreInitial: false,//true,
        ignored: (path, stats) => {
            if (path.endsWith('.md')) return false;// only watch md files
            if (path.includes('node_modules')) return true;
            return;
        }
    });

    watcher
        .on('add', (path) => {
            let file = readFileSync(path, "utf8");
            file = frontMatter(file).body;
            let header = frontMatter(file).frontmatter;
            let attributes = frontMatter(file).attributes;
            graph.addNode(path, Object.assign({},{ content: file },{header},attributes));
            const bytes = merkleTree.bufferify(file);
            merkleTree.addLeaf(bytes);
            dht.put(new Key(path), bytes);
            path = encodeURI(path)
            client.publish(`obsidian/${path}`, JSON.stringify({
                extendedKey: 'add',
                merkleRoot: merkleTree.getHexRoot(),
                graph: graph.export(),
                dht: [
                    [`/obsidian/${path}`, [bytes.toString("hex"), `http://${host}:${port}/obsidian/${path}`]]
                ]
            }));
            app.use(`/obsidian/${path}`, (req, res) => {
                // console.log(file)
                res.json({
                    event: 'add',
                    path,
                    file
                })
            });
            console.log(`File added: http://${host}:${port}/obsidian/${path}`, file.split("\n"));
        })
        .on('change', (path) => {
            const file = readFileSync(path, "utf8");
            console.log(`File changed: ${path.split("/")}`, file.split("\n"));
            client.publish(`obsidian/${path}`, JSON.stringify({ event: 'change', path, file }));
            // map.set(path, file)
        })
        .on('unlink', (path) => {
            console.log(`File removed: ${path}`);
            client.publish(`obsidian/${path}`, JSON.stringify({ event: 'unlink', path }));
            // map.delete(path)
        })
        .on('error', (error) => {
            console.error(`Watcher error: ${error}`);
        });

    console.log(`Watching for changes in: ${WATCH_FOLDER}`);

    const log = console.log.bind(console);

    watcher
        .on('addDir', path => log(`Directory ${path} has been added`))
        .on('unlinkDir', path => log(`Directory ${path} has been removed`))
        .on('error', error => log(`Watcher error: ${error}`))
        .on('ready', () => log('Initial scan complete. Ready for changes'))

});