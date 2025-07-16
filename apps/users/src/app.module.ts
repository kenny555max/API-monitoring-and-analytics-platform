import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DatabaseConfig} from './config/database.config';
import { validate } from './config/env.validation';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
      // Load configuration with validation
      ConfigModule.forRoot({
        isGlobal: true,
        validate,
        envFilePath: ['.env.local', '.env'],
      }),

      // TypeORM with async configuration
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => DatabaseConfig.getConfig(configService),
        inject: [ConfigService],
      }),
      UsersModule,
      RedisModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
