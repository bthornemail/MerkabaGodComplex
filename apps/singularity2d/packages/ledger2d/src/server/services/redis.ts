import { Redis } from "ioredis"
const host = "127.0.0.1"
const port = 6379;
let redis: Redis = new Redis({
    port, // Redis port
    // host: "127.0.0.1", // Redis host
    host, // Redis host
    // username: "default", // needs Redis >= 6
    // password: "my-top-secret",
    db: 0, // Defaults to 0
});

let db1: Redis = new Redis({
    port, // Redis port
    // host: "127.0.0.1", // Redis host
    host, // Redis host
    // username: "default", // needs Redis >= 6
    // password: "my-top-secret",
    db: 1, // Defaults to 0
});

let db2: Redis = new Redis({
    port, // Redis port
    // host: "127.0.0.1", // Redis host
    host, // Redis host
    // username: "default", // needs Redis >= 6
    // password: "my-top-secret",
    db: 2, // Defaults to 0
});
// console.log(redis.options.db)
// redis.options.db = 1
// console.log(redis.options.db)
export { redis as db0, db1, db2 }

export default redis