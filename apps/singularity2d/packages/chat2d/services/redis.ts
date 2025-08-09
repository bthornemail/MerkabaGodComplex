import { Redis } from "ioredis";
let redis: Redis = new Redis({
  // port: Number(process.env.REDIS_PORT), // Redis port
  // host: process.env.REDIS_HOST, // Redis host
  // username: "default", // needs Redis >= 6
  //   password: process.env.REDIS_PASSWORD,
  db: 10
});
redis.on('error', (error) => {
  console.error(error.message);
  console.error(error.message.includes("ECONNREFUSED"));
  // if (error.message.includes("ECONNREFUSED")) {
  //   redis = new Redis({
  //     // port: Number(process.env.REDIS_PORT), // Redis port
  //     host: "bthorne.org", // Redis host
  //     // username: "default", // needs Redis >= 6
  //       // password: process.env.REDIS_PASSWORD,
  //     db: 10
  //   });
  // }

});
redis.on('connect', () => {
  console.log('Connected to Redis');
});
export default redis;