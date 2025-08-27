import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({ data: createPaymentDto });
  }

  async findAll() {
    return this.prisma.payment.findMany();
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({ where: { id } });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.prisma.payment.update({ where: { id }, data: updatePaymentDto });
  }

  async remove(id: string) {
    return this.prisma.payment.delete({ where: { id } });
  }

  // Initiate a Pesapal payment (card/MPesa)
  async initiatePesapalPayment(data: {
    amount: number;
    currency: string;
    description: string;
    email: string;
    phone: string;
    reference: string;
    callback_url: string;
    provider: 'card' | 'mpesa';
    metadata?: any;
  }) {
    // TODO: Integrate with Pesapal API
    // 1. Create payment request to Pesapal
    // 2. Save payment initiation details to DB
    // 3. Return payment URL or token for frontend redirection
    return 'This action initiates a Pesapal payment';
  }

  // Handle Pesapal IPN/webhook callback
  async handlePesapalIPN(payload: any) {
    // TODO: Process Pesapal IPN/webhook
    // 1. Validate IPN signature
    // 2. Update payment and order status in DB
    // 3. Log transaction details
    return 'This action handles Pesapal IPN/webhook callback';
  }

  // Update order/payment status after payment confirmation
  async updateOrderPaymentStatus(orderId: string, status: 'pending' | 'paid' | 'failed' | 'refunded') {
    // TODO: Update order/payment status in DB
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });

    if (!payment) {
      throw new NotFoundException(`Payment for order ${orderId} not found`);
    }

    return this.prisma.payment.update({
      where: { orderId },
      data: { status, paidAt: status === 'paid' ? new Date() : undefined },
    });
  }
}
