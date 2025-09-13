import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { supabase } from '../supabase/supabase.client';

@Injectable()
export class PaymentService {
  constructor() {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { data, error } = await supabase
      .from('payment')
      .insert([createPaymentDto])
      .select()
      .single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await supabase.from('payment').select('*');
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await supabase
      .from('payment')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const { data, error } = await supabase
      .from('payment')
      .update(updatePaymentDto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async remove(id: string) {
    const { data, error } = await supabase
      .from('payment')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw new NotFoundException(error.message);
    return data;
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
    // Find payment by orderId
    const { data: payment, error } = await supabase
      .from('payment')
      .select('*')
      .eq('orderId', orderId)
      .single();

    if (error || !payment) {
      throw new NotFoundException(`Payment for order ${orderId} not found`);
    }

    const { data: updated, error: updateError } = await supabase
      .from('payment')
      .update({
        status,
        paidAt: status === 'paid' ? new Date().toISOString() : undefined,
      })
      .eq('orderId', orderId)
      .select()
      .single();

    if (updateError) throw new NotFoundException(updateError.message);
    return updated;
  }
}
