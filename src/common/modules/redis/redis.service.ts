import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_PROVIDER_TOKEN } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);

    constructor(@Inject(REDIS_PROVIDER_TOKEN) private readonly redisClient: Redis) {}

    onModuleDestroy() {
        this.redisClient.disconnect();
    }

    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        if (ttlSeconds) {
            await this.redisClient.set(key, stringValue, 'EX', ttlSeconds);
        } else {
            await this.redisClient.set(key, stringValue);
        }
        this.logger.debug(`Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redisClient.get(key);
        if (!data) {
            this.logger.debug(`Cache MISS: ${key}`);
            return null;
        }
        this.logger.debug(`Cache HIT: ${key}`);
        try {
            return JSON.parse(data) as T;
        } catch {
            return data as unknown as T;
        }
    }

    async del(key: string): Promise<void> {
        await this.redisClient.del(key);
        this.logger.debug(`Cache DEL: ${key}`);
    }

    async delPattern(pattern: string): Promise<number> {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length === 0) {
            return 0;
        }
        const result = await this.redisClient.del(...keys);
        this.logger.debug(`Cache DEL pattern: ${pattern} (${result} keys deleted)`);
        return result;
    }

    async delMultiple(keys: string[]): Promise<number> {
        if (keys.length === 0) return 0;
        const result = await this.redisClient.del(...keys);
        this.logger.debug(`Cache DEL multiple: ${keys.length} keys`);
        return result;
    }

    async setIfNotExists(key: string, value: unknown, ttlSeconds: number): Promise<boolean> {
        const stringValue = JSON.stringify(value);
        const result = await this.redisClient.set(key, stringValue, 'EX', ttlSeconds, 'NX');
        return result === 'OK';
    }

    async expire(key: string, ttlSeconds: number): Promise<boolean> {
        const result = await this.redisClient.expire(key, ttlSeconds);
        return result === 1;
    }

    async ttl(key: string): Promise<number> {
        return this.redisClient.ttl(key);
    }

    async invalidateByTags(tags: string[]): Promise<number> {
        let totalDeleted = 0;
        for (const tag of tags) {
            const deleted = await this.delPattern(`*:${tag}:*`);
            totalDeleted += deleted;
        }
        return totalDeleted;
    }

    async mget<T>(keys: string[]): Promise<(T | null)[]> {
        if (keys.length === 0) return [];
        const values = await this.redisClient.mget(...keys);
        return values.map((value) => {
            if (!value) return null;
            try {
                return JSON.parse(value) as T;
            } catch {
                return value as unknown as T;
            }
        });
    }

    async mset(keyValuePairs: Record<string, any>): Promise<void> {
        const pairs: string[] = [];
        for (const [key, value] of Object.entries(keyValuePairs)) {
            pairs.push(key, JSON.stringify(value));
        }
        await this.redisClient.mset(...pairs);
    }
}
