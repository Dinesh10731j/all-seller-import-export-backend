import assert from "node:assert/strict";
import {
  SingleTabGuardService,
  TabLockStore,
} from "../service/session/single_tab_guard.service";

class InMemoryTabLockStore implements TabLockStore {
  private data = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async del(key: string): Promise<void> {
    this.data.delete(key);
  }
}

const run = async () => {
  const service = new SingleTabGuardService(new InMemoryTabLockStore(), 60);

  const first = await service.assertSingleTab(10, "tab-A");
  assert.equal(first.allowed, true);

  const sameTab = await service.assertSingleTab(10, "tab-A");
  assert.equal(sameTab.allowed, true);

  const secondTab = await service.assertSingleTab(10, "tab-B");
  assert.equal(secondTab.allowed, false);

  await service.release(10);

  const afterRelease = await service.assertSingleTab(10, "tab-B");
  assert.equal(afterRelease.allowed, true);

  console.log("Single-tab guard tests passed.");
};

run().catch((error: unknown) => {
  console.error("Single-tab guard tests failed.", error);
  process.exit(1);
});
