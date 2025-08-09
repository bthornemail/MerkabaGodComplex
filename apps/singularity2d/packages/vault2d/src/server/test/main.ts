import { HDNodeWallet } from "ethers";
import mqtt from "mqtt";
import { Environment } from "./modules/environment/index";
import { BrowserEnvironment } from "./modules/environment/browser";
import { Person } from "./modules/user";
import express, { Request, Response } from 'express';
import net from 'net';
import http from 'http';
import ngrok from 'ngrok'; // Import Ngrok
import cors from 'cors';
import crypto from 'crypto';
import base64url from 'base64url';
import { writeFileSync } from 'fs';

(async () => {
  const environment = new BrowserEnvironment();
  await environment.render();
  environment.dom.window.postMessage({type:"LOGIN",data:"Hello"},"http://localhost:30000")
  // writeFileSync("../public/vault2d.html",environment.dom.serialize());
})();