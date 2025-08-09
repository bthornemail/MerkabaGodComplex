import { Redis } from "ioredis";
const redis = new Redis({
    db: 10,
});

export default redis;