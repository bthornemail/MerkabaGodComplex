import express, { Request, Response } from 'express';
import { CID } from 'multiformats/cid'
import * as json from 'multiformats/codecs/json'
import { sha256 } from 'multiformats/hashes/sha2'
import { Key } from 'interface-datastore'
import __get_dirname from '../bin/commands/get.dir.name.js';
import { verifyMessage, HDNodeWallet } from 'ethers';
import path, { join } from 'node:path';
export default function PeerServer({ user, graph, blockstore, datastore, host, port, isLogged }) {
  const app = express();
  app.use((req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });
  app.set('trust proxy', true)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  // app.use(express.static(join(import.meta.dirname, "../public")));

  app.get(`/graph.json`, (req: Request, res: Response) => {
    res.json(graph.export())
    // res.redirect("http://127.0.0.1:5173")
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
    app.listen(port, async () => {
      console.log(`${user.identity} on http://${host}:${port}`);
      console.log(`Listening to http://${host}:${port}/api`);
      console.log(`Listening to http://${host}:${port}/api/register`);
      console.log(`Listening to http://${host}:${port}/api/all`);
      console.log(`Listening to http://${host}:${port}/markdown`);
    });
    return app;
  }
}