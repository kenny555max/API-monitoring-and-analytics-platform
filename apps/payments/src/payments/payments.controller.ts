import {Controller, Inject} from '@nestjs/common';
import {ClientProxy, EventPattern, Payload} from '@nestjs/microservices';
import { PaymentsMicroserviceService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller()
export class PaymentsMicroserviceController {
  constructor(
      @Inject('NATS_SERVICE') private natsClient: ClientProxy,
      private readonly paymentsService: PaymentsMicroserviceService
  ) {}

  @EventPattern('createPayment')
  create(@Payload() createPaymentDto: CreatePaymentDto) {
    console.log('payments microservices emitted');
    const payment_created = this.paymentsService.create(createPaymentDto);
    this.natsClient.emit('payment-created-event-to-user', payment_created);
    return payment_created;
  }
}
