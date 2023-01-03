import { inject, injectable } from 'inversify';
// import redis, { RedisClientType } from 'redis';
import * as redis from 'redis';
import { RedisClientType } from 'redis';
import { throwException } from '../../shared/errors/all.exception';
import { Logger } from '../../shared/services/logger.service';
import { IRedisService } from '../interface/IRedis.service';
import { TYPES } from '../type.core';

@injectable()
export class RedisService implements IRedisService {
    private static redisClient: RedisClientType;

    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger
    ) { }

    private async redisConnection(): Promise<RedisClientType> {
        try {
            RedisService.redisClient = redis.createClient({
                socket: {
                    port: +process.env.REDIS_PORT!,
                    host: process.env.REDIS_HOST
                },
                password: process.env.REDIS_PASSWORD,
            });
            await RedisService.redisClient.connect();
            this.logger.info('Redis connected!');
        } catch (error) {
            this.logger.error(`Redis connection failed. Error ${error}`);
        }
        return RedisService.redisClient;
    }

    async saveData({ key, value, exp = 600 }: { key: string, value: any, exp: number }): Promise<boolean> {
        try {
            const client = await this.redisConnection();
            await this.deleteData({ key });
            await client.setEx(key, exp, value);
            return true;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getData({ key }: { key: string }): Promise<any> {
        try {
            const client = await this.redisConnection();
            return await client.get(key);
        } catch (error: any) {
            return throwException(error);
        }
    }

    async deleteData({ key }: { key: string }): Promise<boolean> {
        try {
            const client = await this.redisConnection();
            await client.del(key);
            return true;
        } catch (error: any) {
            return throwException(error);
        }
    }
}