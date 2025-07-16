import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {NatsClientModule} from "../nats-client/nats-client.module";

@Module({
  imports: [
      NatsClientModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
