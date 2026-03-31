"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_config_1 = require("../configs/env.config");
const redisUrl = env_config_1.envConfig.REDIS_URL || "redis://127.0.0.1:6379";
exports.redisConnection = new ioredis_1.default(redisUrl, {
    maxRetriesPerRequest: null,
});
//# sourceMappingURL=redis.js.map