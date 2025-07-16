import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export default new DataSource({
    type: 'mysql',
    host: configService.get('DATABASE_HOST', 'mysql_db'),
    port: configService.get('DATABASE_PORT', 3306),
    username: configService.get('DATABASE_USERNAME', 'kenny_db'),
    password: configService.get('DATABASE_PASSWORD', 'kenny'),
    database: configService.get('DATABASE_NAME', 'nestjs_db'),
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false, // Always false for migrations
});