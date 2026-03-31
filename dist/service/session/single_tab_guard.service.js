"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleTabGuardService = exports.SingleTabGuardService = exports.RedisTabLockStore = void 0;
class RedisTabLockStore {
    getRedis() {
        const { redisConnection } = require("../../queue/redis");
        return redisConnection;
    }
    async get(key) {
        return this.getRedis().get(key);
    }
    async set(key, value, ttlSeconds) {
        await this.getRedis().set(key, value, "EX", ttlSeconds);
    }
    async del(key) {
        await this.getRedis().del(key);
    }
}
exports.RedisTabLockStore = RedisTabLockStore;
class SingleTabGuardService {
    constructor(store, ttlSeconds = 2 * 60 * 60) {
        this.store = store;
        this.ttlSeconds = ttlSeconds;
    }
    userKey(userId) {
        return `single_tab:user:${userId}`;
    }
    async assertSingleTab(userId, tabId) {
        const key = this.userKey(userId);
        const existingTabId = await this.store.get(key);
        if (existingTabId && existingTabId !== tabId) {
            return {
                allowed: false,
                activeTabId: existingTabId,
            };
        }
        await this.store.set(key, tabId, this.ttlSeconds);
        return { allowed: true };
    }
    async release(userId) {
        await this.store.del(this.userKey(userId));
    }
}
exports.SingleTabGuardService = SingleTabGuardService;
exports.singleTabGuardService = new SingleTabGuardService(new RedisTabLockStore());
//# sourceMappingURL=single_tab_guard.service.js.map