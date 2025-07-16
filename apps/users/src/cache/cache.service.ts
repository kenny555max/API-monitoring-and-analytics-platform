import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService {
    constructor(private readonly redisService: RedisService) {}

    async get<T>(key: string): Promise<T | null> {
        return await this.redisService.getJson<T>(key);
    }

    async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
        await this.redisService.setJson(key, value, ttl);
    }

    async invalidate(key: string): Promise<void> {
        await this.redisService.del(key);
    }

    async invalidatePattern(pattern: string): Promise<void> {
        const keys = await this.redisService.keys(pattern);
        if (keys.length > 0) {
            await Promise.all(keys.map(key => this.redisService.del(key)));
        }
    }

    generateKey(prefix: string, ...parts: string[]): string {
        return `${prefix}:${parts.join(':')}`;
    }
}