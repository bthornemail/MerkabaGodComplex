import { Redis } from "ioredis"
import { exec } from "node:child_process";

let redis: Redis = new Redis({
    port: 6379, // Redis port
    // host: 'life2d.com', // Redis host
    host: '127.0.0.1', // Redis host
    // username: "default", // needs Redis >= 6
    // password: "passwd84",
    db: 10, // Defaults to 0
    // connectTimeout: 1000,
    // lazyConnect: true
})
// const redisExec = exec("redis-server");
// redisExec.stdout?.once('data', (data) => {
//     console.log(`stdout: ${data}`);
//     console.log("Redis is ready to accept connections")
//     // const redis = new Redis()

//     redis.set("mykey", "value"); // Returns a promise which resolves to "OK" when the command succeeds.

//     redis.get("mykey").then((result) => {
//         console.log(result); // Prints "value"
//     });
// })
export default redis