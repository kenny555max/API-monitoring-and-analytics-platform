import { Module } from '@nestjs/common';
import { PaymentsMicroserviceService } from './payments.service';
import { PaymentsMicroserviceController } from './payments.controller';
import {NatsClientModule} from "../nats-client/nats-client.module";

@Module({
  imports: [NatsClientModule],
  controllers: [PaymentsMicroserviceController],
  providers: [PaymentsMicroserviceService],
})
export class PaymentsModule {}
