import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_PROVIDER_TOKEN } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
    providers: [
        {
            provide: REDIS_PROVIDER_TOKEN,
            useFactory: (configService: ConfigService) => {
                return new Redis({
                    host: configService.get<string>('redis.host'),
                    port: configService.get<number>('redis.port'),
                    password: configService.get<string>('redis.password'),
                    db: configService.get<number>('redis.db'),
                    maxRetriesPerRequest: null,
                });
            },
            inject: [ConfigService],
        },
        RedisService,
    ],
    exports: [REDIS_PROVIDER_TOKEN, RedisService],
})
export class RedisModule {}
