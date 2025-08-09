import express, { Request, Response } from "express";
import { join } from 'node:path';
const protocol = "ws";
const host = "127.0.0.1";
let port = 8888;

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
  console.log("req.path", req.path)
  res.sendStatus(404);
});

app.use("/obsidian", express.static(join(import.meta.dirname, "./public/monitor")));

app.listen(port, () => {
  console.log(`HTTP Server on http://${host}:${port}`);
  // console.log(`${bright}${blue}${identity}${reset}: HTTP Server on http://${host}:${port}`);
  // console.log(`${bright}${blue}${identity}${reset}: Get specfied identity @ http://${host}:${port}/:identity`);
  // console.log(`${bright}${blue}${identity}${reset}: specfied identity from context @ http://${host}:${port}/:context/:identity`);
  // console.log(`${bright}${blue}${identity}${reset}: Set specfied identity @ http://${host}:${port}/:identity`);
  // console.log(`${bright}${blue}${identity}${reset}: Set specfied identity to context @ http://${host}:${port}/:context/:identity`);
});