export interface TabLockStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
}

export class RedisTabLockStore implements TabLockStore {
  private getRedis() {
    const { redisConnection } = require("../../queue/redis") as {
      redisConnection: {
        get: (key: string) => Promise<string | null>;
        set: (
          key: string,
          value: string,
          mode: "EX",
          ttlSeconds: number
        ) => Promise<unknown>;
        del: (key: string) => Promise<number>;
      };
    };

    return redisConnection;
  }

  async get(key: string): Promise<string | null> {
    return this.getRedis().get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.getRedis().set(key, value, "EX", ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.getRedis().del(key);
  }
}

export type SingleTabCheckResult =
  | { allowed: true }
  | {
      allowed: false;
      activeTabId: string;
    };

export class SingleTabGuardService {
  constructor(
    private readonly store: TabLockStore,
    private readonly ttlSeconds: number = 2 * 60 * 60
  ) {}

  private userKey(userId: number) {
    return `single_tab:user:${userId}`;
  }

  async assertSingleTab(userId: number, tabId: string): Promise<SingleTabCheckResult> {
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

  async release(userId: number): Promise<void> {
    await this.store.del(this.userKey(userId));
  }
}

export const singleTabGuardService = new SingleTabGuardService(new RedisTabLockStore());
