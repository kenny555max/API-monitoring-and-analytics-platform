import { plainToInstance, Transform } from 'class-transformer';
import { IsNumber, IsString, IsBoolean, IsOptional, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsOptional()
  DATABASE_HOST?: string = 'mysql_db';

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  DATABASE_PORT?: number = 3306;

  @IsString()
  @IsOptional()
  DATABASE_USERNAME?: string = 'kenny_db';

  @IsString()
  @IsOptional()
  DATABASE_PASSWORD?: string = 'kenny';

  @IsString()
  @IsOptional()
  DATABASE_NAME?: string = 'nestjs_db';

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  DATABASE_SYNC?: boolean = true;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  DATABASE_LOGGING?: boolean = false;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  DATABASE_RETRY_ATTEMPTS?: number = 10;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  DATABASE_RETRY_DELAY?: number = 3000;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  DATABASE_POOL_SIZE?: number = 10;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  DATABASE_CONNECT_TIMEOUT?: number = 30000;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  DATABASE_ACQUIRE_TIMEOUT?: number = 30000;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}