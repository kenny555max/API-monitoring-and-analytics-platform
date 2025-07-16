import {Controller, Post, Body, Inject} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {ClientProxy} from "@nestjs/microservices";

@Controller('payments')
export class PaymentsController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('/create-payment')
  create(@Body() createPaymentDto: CreatePaymentDto) {
      return this.natsClient.emit('createPayment', createPaymentDto);
  }
}
