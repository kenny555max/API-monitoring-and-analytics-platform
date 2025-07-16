import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';

async function bootstrap() {
  console.log('Starting users microservice...');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.NATS,
        options: {
          servers: [`nats://nats:4222`],
            retryAttempts: 1000,
        }
      }
  );
  await app.listen();
}
bootstrap();
