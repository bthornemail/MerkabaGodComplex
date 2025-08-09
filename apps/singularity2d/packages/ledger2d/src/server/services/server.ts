import express, { Request, Response } from 'express';
import __get_dirname from '../bin/commands/get.dir.name.js';
import ip from "../bin/commands/get.ip.addresses.js";
import * as dotenv from "dotenv";
dotenv.config();
const host = "127.0.0.1";
const port = 3001;

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.set('trust proxy', true)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static(join(__dirname,'../','public')));
app.use(express.static(__get_dirname(import.meta.url, '../public')));

app.listen(port, async () => {
  console.log(Object.entries(ip).map(([key, value]) => `http://${value}:${port}`))
  // const nets = Object.values(ip)[0].filter((key) => key.includes("192") || key.includes("127"))
  // console.log(Object.values(ip).filter((key) => key.includes("192")))
  // console.log(nets)
  console.log(`Listening to http://${host}:${port}`);
});
export default app