import { readFileSync } from "node:fs";
import chat from "./chat";
import { join } from "node:path";
(async()=>{
    await chat(process.argv[2] || readFileSync(join(__dirname,"init","input.txt"),"utf-8"),process.argv[3]);
})()