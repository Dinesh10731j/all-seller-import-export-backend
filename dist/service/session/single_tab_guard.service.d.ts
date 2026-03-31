export interface TabLockStore {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds: number): Promise<void>;
    del(key: string): Promise<void>;
}
export declare class RedisTabLockStore implements TabLockStore {
    private getRedis;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds: number): Promise<void>;
    del(key: string): Promise<void>;
}
export type SingleTabCheckResult = {
    allowed: true;
} | {
    allowed: false;
    activeTabId: string;
};
export declare class SingleTabGuardService {
    private readonly store;
    private readonly ttlSeconds;
    constructor(store: TabLockStore, ttlSeconds?: number);
    private userKey;
    assertSingleTab(userId: number, tabId: string): Promise<SingleTabCheckResult>;
    release(userId: number): Promise<void>;
}
export declare const singleTabGuardService: SingleTabGuardService;
//# sourceMappingURL=single_tab_guard.service.d.ts.map