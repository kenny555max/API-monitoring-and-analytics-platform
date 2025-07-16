import {ConfigService} from "@nestjs/config";
import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export class DatabaseConfig {
    static getConfig(configService: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: configService.get<string>('DATABASE_HOST'),
            port: configService.get<number>('DATABASE_PORT'),
            username: configService.get<string>('DATABASE_USERNAME'),
            password: configService.get<string>('DATABASE_PASSWORD'),
            database: configService.get<string>('DATABASE_NAME'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get<boolean>('DATABASE_SYNC'),
            logging: configService.get<boolean>('DATABASE_LOGGING'),
            retryAttempts: configService.get<number>('DATABASE_RETRY_ATTEMPTS'),
            retryDelay: configService.get<number>('DATABASE_RETRY_DELAY'),
            autoLoadEntities: true,
            extra: {
                charset: 'utf8mb4_unicode_ci',
            },
            poolSize: configService.get<number>('DATABASE_POOL_SIZE'),
            connectTimeout: configService.get<number>('DATABASE_CONNECT_TIMEOUT'),
        };
    }
}