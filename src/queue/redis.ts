import IORedis from "ioredis";
import { envConfig } from "../configs/env.config";

const redisUrl = envConfig.REDIS_URL || "redis://127.0.0.1:6379";

export const redisConnection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

