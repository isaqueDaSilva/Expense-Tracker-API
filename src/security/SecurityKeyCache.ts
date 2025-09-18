export class SecurityKeyCache {
    private static instance: SecurityKeyCache;
    private cache: Map<string, Buffer> = new Map();

    private constructor() {}

    public static getInstance(): SecurityKeyCache {
        if (!SecurityKeyCache.instance) {
            SecurityKeyCache.instance = new SecurityKeyCache();
        }
        return SecurityKeyCache.instance;
    }

    public setKey(id: string, key: Buffer): void {
        this.cache.set(id, key);
    }

    public getPrivateKey(id: string): Buffer | null {
        return this.cache.get(id) || null;
    }

    public deleteKey(id: string): void {
        this.cache.delete(id);
    }
}