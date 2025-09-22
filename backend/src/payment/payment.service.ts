import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { supabase } from '../supabase/supabase.client';
import axios from 'axios';

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
    // 1. Get OAuth token from Pesapal
    const pesapalBaseUrl = process.env.PESAPAL_API_URL;
    const pesapalKey = process.env.PESAPAL_CONSUMER_KEY;
    const pesapalSecret = process.env.PESAPAL_CONSUMER_SECRET;

    let accessToken: string;
    try {
      const tokenRes = await axios.post(
        `${pesapalBaseUrl}/api/Auth/RequestToken`,
        {
          consumer_key: pesapalKey,
          consumer_secret: pesapalSecret,
        }
      );
      accessToken = tokenRes.data.token;
    } catch (err) {
      throw new InternalServerErrorException('Failed to get Pesapal token');
    }

    // 2. Create payment order
    let paymentUrl: string;
    let pesapalResponse: any;
    try {
      const orderRes = await axios.post(
        `${pesapalBaseUrl}/api/Transactions/SubmitOrderRequest`,
        {
          id: data.reference,
          currency: data.currency,
          amount: data.amount,
          description: data.description,
          callback_url: data.callback_url,
          notification_id: data.reference,
          billing_address: {
            email_address: data.email,
            phone_number: data.phone,
            first_name: data.metadata?.firstName || '',
            last_name: data.metadata?.lastName || '',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      pesapalResponse = orderRes.data;
      paymentUrl = pesapalResponse.redirect_url;
    } catch (err) {
      throw new InternalServerErrorException('Failed to create Pesapal order');
    }

    // 3. Save payment initiation details to DB
    const paymentDto = {
      order_id: data.reference,
      first_name: data.metadata?.firstName || '',
      last_name: data.metadata?.lastName || '',
      email: data.email,
      phone: data.phone,
      provider: 'pesapal',
      status: 'pending',
      reference: data.reference,
      amount: data.amount,
      metadata: pesapalResponse,
    };
    const { data: saved, error } = await supabase
      .from('payment')
      .insert([paymentDto])
      .select()
      .single();
    if (error) throw new NotFoundException(error.message);

    // 4. Return payment URL for frontend redirection
    return { paymentUrl, pesapalResponse, payment: saved };
  }

  // Handle Pesapal IPN/webhook callback
  async handlePesapalIPN(payload: any, signature?: string) {
    // 1. Validate IPN signature (Pesapal sends X-Pesapal-Notification-Signature header)
    // For production, verify signature using your Pesapal secret
    // Example: if (signature !== expectedSignature) throw new ForbiddenException('Invalid IPN signature');
    // TODO: Implement signature validation for production

    // 2. Update payment and order status in DB
    const reference = payload?.order_tracking_id || payload?.reference;
    if (!reference) throw new NotFoundException('Reference not found in IPN');

    // 3. Update payment record
    const { data: payment, error } = await supabase
      .from('payment')
      .select('*')
      .eq('reference', reference)
      .single();
    if (error || !payment) throw new NotFoundException('Payment not found');

    const status = payload?.status || 'pending';
    const paidAt = status === 'paid' ? new Date().toISOString() : undefined;

    const { data: updated, error: updateError } = await supabase
      .from('payment')
      .update({
        status,
        paid_at: paidAt,
        callback_data: payload,
      })
      .eq('reference', reference)
      .select()
      .single();
    if (updateError) throw new NotFoundException(updateError.message);

    // 4. Log transaction details (could add more logging here)
    return updated;
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
        paid_at: status === 'paid' ? new Date().toISOString() : undefined,
      })
      .eq('order_id', orderId)
      .select()
      .single();

    if (updateError) throw new NotFoundException(updateError.message);
    return updated;
  }
}
