import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }

  // Initiate Pesapal payment
  @Post('pesapal/initiate')
  initiatePesapalPayment(@Body() body: {
    amount: number;
    email: string;
    reference: string;
    callback_url: string;
    provider: 'card' | 'mpesa';
    metadata?: any;
    currency?: string;
    description?: string;
    phone?: string;
  }) {
    // Ensure all required fields for the service
    const {
      amount,
      email,
      reference,
      callback_url,
      provider,
      metadata,
      currency,
      description,
      phone,
    } = body;

    return this.paymentService.initiatePesapalPayment({
      amount,
      currency: currency || 'KES',
      description: description || 'Order payment',
      email,
      phone: phone || '',
      reference,
      callback_url,
      provider,
      metadata,
    });
  }

  // Pesapal IPN/webhook callback
  @Post('pesapal/webhook')
  handlePesapalWebhook(@Body() payload: any) {
    return this.paymentService.handlePesapalIPN(payload);
  }
}
