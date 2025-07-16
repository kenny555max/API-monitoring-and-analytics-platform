import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import {NatsClientModule} from "../nats-client/nats-client.module";

@Module({
  imports: [
      NatsClientModule
  ],
  controllers: [PaymentsController],
  providers: [],
})
export class PaymentsModule {}
