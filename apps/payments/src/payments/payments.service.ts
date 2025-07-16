import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsMicroserviceService {
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }
}
