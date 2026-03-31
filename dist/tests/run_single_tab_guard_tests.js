"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const single_tab_guard_service_1 = require("../service/session/single_tab_guard.service");
class InMemoryTabLockStore {
    constructor() {
        this.data = new Map();
    }
    async get(key) {
        return this.data.get(key) ?? null;
    }
    async set(key, value) {
        this.data.set(key, value);
    }
    async del(key) {
        this.data.delete(key);
    }
}
const run = async () => {
    const service = new single_tab_guard_service_1.SingleTabGuardService(new InMemoryTabLockStore(), 60);
    const first = await service.assertSingleTab(10, "tab-A");
    strict_1.default.equal(first.allowed, true);
    const sameTab = await service.assertSingleTab(10, "tab-A");
    strict_1.default.equal(sameTab.allowed, true);
    const secondTab = await service.assertSingleTab(10, "tab-B");
    strict_1.default.equal(secondTab.allowed, false);
    await service.release(10);
    const afterRelease = await service.assertSingleTab(10, "tab-B");
    strict_1.default.equal(afterRelease.allowed, true);
    console.log("Single-tab guard tests passed.");
};
run().catch((error) => {
    console.error("Single-tab guard tests failed.", error);
    process.exit(1);
});
//# sourceMappingURL=run_single_tab_guard_tests.js.map