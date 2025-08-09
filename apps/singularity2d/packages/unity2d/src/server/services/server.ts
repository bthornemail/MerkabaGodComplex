import express, { Request, Response } from 'express';
import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import { Key } from 'interface-datastore'
import __get_dirname from '../bin/commands/get.dir.name.js';
import { CategoryMap, Channels } from '../types/data/data.categories';
import { verifyMessage, HDNodeWallet } from 'ethers';
import path, { join } from 'node:path';
import multer from 'multer';
import { writeFileSync, readFileSync } from 'node:fs';

export default function Server({ user, graph, blockstore, datastore, host, port, isLogged }) {
  const app = express();
  app.use((req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
  app.set('trust proxy', true)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static(join(import.meta.dirname, "../public")));

  app.get(`/graph.json`, (req: Request, res: Response) => {
    res.json(graph.export())
    // res.redirect("http://127.0.0.1:5173")
  });
  app.get(`/api`, (req: Request, res: Response) => {
    isLogged ?? console.log("Getting categories")
    res.json(Channels)
  });
  app.get(`/api/register/:address/:signature`, async (req, res) => {
    const address = verifyMessage(req.params.address, req.params.signature);
    if (req.params.address !== verifyMessage(req.params.address, req.params.signature)) return res.sendStatus(404)
    await datastore.open()
    const wallet = HDNodeWallet.createRandom("", "m/369/0")
    const bytes = json.encode(wallet);//address);
    const hash = await sha256.digest(bytes)
    const cid = CID.create(1, json.code, hash)
    const key = await datastore.put(new Key(new TextEncoder().encode(address)), bytes);
    await datastore.close()
    res.json({ cid, key, hash, bytes, address, wallet })
  });
  app.get(`/api/set`, async (req, res) => {
    isLogged ?? console.log("Setting Node Body")
    const wallet = HDNodeWallet.createRandom("", "m/369/0");
    const peer = { ...wallet.neuter(), ...req.body }//,Object.assign({},wallet.neuter())
    const { cid, block, key } = await user.put(peer)
    res.json({
      cid,
      wallet,
      peer,
      // hash,
      key: key.toString(),
      block: block.toJSON()
    })
  });
  app.get(`/api/all`, async (req, res) => {
    isLogged ?? console.log("Registering Wallet")
    await blockstore.open()
    await datastore.open()
    const blocks = new Map([]);
    for await (const { cid, block } of blockstore.getAll()) {
      // console.log('got:', cid.toString(), block.toString());
      blocks.set(cid.toString(), block.toString())
      // => got MultihashDigest('Qmfoo') Uint8Array[...]
    }

    const values = new Map([]);
    for await (const { key, value } of datastore.query({})) {
      values.set(key.toString(), value.toString())
    }
    isLogged ?? console.log('ALL THE VALUES', values)
    await datastore.close()
    await blockstore.close()
    res.json({
      values: Array.from(values),
      blocks: Array.from(blocks)
    })
  });
  app.post(`/api/:category/:subcategory`, (req: Request, res: Response) => {
    isLogged ?? console.log("Getting categories")
    CategoryMap.get(req.params.category)?.get(req.params.subcategory)?.push(req.body)
    res.json(Array.from(CategoryMap.entries()))
  });
  CategoryMap.forEach((subcategories, category) => {
    isLogged ?? console.log("Registering category", category)
    app.get(`/api/${category}`, (req: Request, res: Response) => {
      isLogged ?? console.log("Getting", category)
      const arr = CategoryMap.get(category);
      res.json(arr ? Array.from(arr) : [])
    })
    subcategories.forEach((channels, subcategory) => {
      isLogged ?? console.log("Registering subcategory", subcategory)
      app.get(`/api/${category}/${subcategory}`, (req: Request, res: Response) => {
        isLogged ?? console.log("Getting", category, subcategory)
        res.json(CategoryMap.get(category)?.get(subcategory))
        // res.json(Channels)
      })
      channels.forEach((channel) => {
        isLogged ?? console.log("Registering channel", channel.title)
        app.get(`/api/${category}/${subcategory}/${channel.id}`, (req: Request, res: Response) => {
          isLogged ?? console.log("Getting", category, subcategory, channel)
          res.json(CategoryMap.get(category)?.get(subcategory)?.filter((_channel) => _channel.id === channel.id))
        })
      })
      channels.forEach((channel) => {
        isLogged ?? console.log("Registering channel id", channel.title, `http://${host}:${port}/api/${channel.id}`)
        app.get(`/api/${channel.id}`, (req: Request, res: Response) => {
          isLogged ?? console.log("Getting", category, subcategory, channel)
          res.json(CategoryMap.get(category)?.get(subcategory)?.filter((_channel) => _channel.id === channel.id))
        })
      })
    })
  });
  const upload = multer({ dest: './public/uploads/' }); // Configuring where to store uploaded files
  app.post('/upload', upload.single('image'), (req: any, res: any) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'public/uploads/image.png');

    if (path.extname(req.file.originalname).toLowerCase() === '.png') {
      writeFileSync(targetPath, readFileSync(tempPath, 'binary'));
      res.status(200).json({ message: 'File uploaded successfully' });
    } else {
      res.status(403).json({ error: 'Only .png files are allowed' });
    }
  });

  return () => {
    const identites = new Map();
    app.use("/get/:id", (req, res, next) => {
      console.log("getting - ", req.params)
      console.log("getting - ", req.query)
      if (identites.get(req.params.id)) return res.send(identites.get(req.params.id));
      next();
    });

    app.use("/set/:id", (req, res, next) => {
      console.log("adding - ", req.params)
      console.log("adding - ", req.query)
      // if(identites.get(req.params.id)) return res.send(req.params.id);
      identites.set(req.params.id, req.query)
      next();
    });
    app.use("/search", (req, res) => {
      res.send(`<div style="display: flex;flex-direction:column;">
    <a href='/app'>app</a>
    <a href="/car-wash">car.wash</a>
    <a href="/chat">chat</a>
    <a href="/delivery-for-locals">delivery.for.locals</a>
    <a href='/force-graph'>force-graph</a>
    <a href="/graph">graph</a>
    <a href="/logistics-hub">logistics-hub</a>
    <a href="/mermaid">mermaid</a>
    <a href="/mqtt">mqtt</a>
    <a href="/helia">helia</a>
    <a href="/service-board">service.board/public</a>
    <a href="/dialpad">dialpad</a>
    <a href="/canvas">canvas</a>
    <a href="/asset">asset</a>
    <a href="/service_board">Service.Board</a>
    <a href="/service_board">Service.Board</a>
    <a href="/vcard">vcard</a>
    <a href="/worker">worker</a>
  </div>`)
    });
    app.use('/app', express.static(__get_dirname(import.meta.url, '../www/app')));
    app.use("/car-wash", express.static(__get_dirname(import.meta.url, '../www/car.wash/public')));
    app.use("/chat", express.static(__get_dirname(import.meta.url, '../www/chat')));
    app.use("/delivery-for-locals", express.static(__get_dirname(import.meta.url, '../www/delivery.for.locals')));
    app.use('/force-graph', express.static(__get_dirname(import.meta.url, '../www/force-graph')));
    app.use("/graph", express.static(__get_dirname(import.meta.url, '../www/graph')));
    app.use("/mermaid", express.static(__get_dirname(import.meta.url, '../www/mermaid')));
    app.use("/mqtt", express.static(__get_dirname(import.meta.url, '../www/mqtt-broker')));
    app.use("/helia", express.static(__get_dirname(import.meta.url, '../www/helia')));
    app.use("/service-board", express.static(__get_dirname(import.meta.url, '../www/service.board/public')));
    app.use("/dialpad", express.static(__get_dirname(import.meta.url, '../www/dialpad')));
    app.use("/canvas", express.static(__get_dirname(import.meta.url, '../www/canvas')));
    app.use("/asset", express.static(__get_dirname(import.meta.url, '../www/asset')));
    app.use("/service_board", express.static(__get_dirname(import.meta.url, '../www/Service.Board')));
    app.use("/service_board", express.static(__get_dirname(import.meta.url, '../www/Service.Board')));
    app.use("/vcard", express.static(__get_dirname(import.meta.url, '../www/vcard')));
    app.use("/worker", express.static(__get_dirname(import.meta.url, '../www/worker')));


    [
      // ["cli", 8000],
      ["Vault2D", 8001],
      ["Journal2D", 8002],
      ["Chat2D", 8003],
      ["Ledger2D", 8004],
      ["Unity2D", 8005],
      ["Life2D", 8006],
      // ["Life2Da", 8016],
      ["Marketplace2D", 8007],
      ["Knowledge2D", 8008],
      ["ServiceChampion", 8009],
      ["Scene", 8010],
    ].forEach(([key, value]) => {
      app.use(`${key.toString().toLowerCase()}`, (req, res) => {
        res.redirect(`${key.toString().toLowerCase()}:${value}/`)
      });
    })
    app.listen(port, async () => {
      console.log(`App on http://${host}:${port}`);
      console.log(`Listening to http://${host}:${port}/api`);
      console.log(`Listening to http://${host}:${port}/api/register`);
      console.log(`Listening to http://${host}:${port}/api/all`);
      console.log(`Listening to http://${host}:${port}/markdown`);
    });
    return app;
  }
}