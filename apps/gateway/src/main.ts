import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  console.log('Starting http client...');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const PORT = process.env.PORT ?? 3000;
  console.log('app listening on ', PORT);
  await app.listen(PORT);
}
bootstrap();