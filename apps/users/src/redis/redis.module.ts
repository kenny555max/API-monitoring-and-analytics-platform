import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('REDIS_URL'),
        options: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB'),
          retryDelayOnFailover: 100,
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
