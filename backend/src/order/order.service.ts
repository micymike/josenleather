import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';
import { NotificationService } from '../notification/notification.service';
import { supabase } from '../supabase/supabase.client';

@Injectable()
export class OrderService {
  constructor(
    private readonly cartService: CartService,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // Calculate total from items (don't trust frontend total)
    let cartTotal = 0;
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      console.log('Processing items:', createOrderDto.items);
      cartTotal = createOrderDto.items.reduce((sum, item) => {
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        console.log(`Item: ${item.productId}, Price: ${item.price}, Qty: ${item.quantity}, Subtotal: ${itemTotal}`);
        return sum + itemTotal;
      }, 0);
    } else {
      throw new BadRequestException('No items provided in order');
    }
    
    console.log('Backend calculated cart total:', cartTotal);
    console.log('Frontend provided total:', createOrderDto.total);
    
    // Calculate delivery fee and payment instruction
    const address = createOrderDto.guestAddress?.toLowerCase() || '';
    let isNairobi = address.includes('nairobi');
    let deliveryFee = 0;
    let paymentInstruction = '';
    let paymentBeforeDelivery = false;

    if (isNairobi) {
      if (cartTotal > 10000) {
        deliveryFee = 0;
        paymentInstruction = 'Delivery is free for orders above 10,000 Ksh within Nairobi. Payment after delivery.';
        paymentBeforeDelivery = false;
      } else {
        deliveryFee = 300;
        paymentInstruction = 'Delivery fee is 300 Ksh within Nairobi for orders below or equal to 10,000 Ksh. Payment after delivery.';
        paymentBeforeDelivery = false;
      }
    } else {
      if (cartTotal > 10000) {
        deliveryFee = 0;
        paymentInstruction = 'Delivery is free for orders above 10,000 Ksh outside Nairobi. Payment required before delivery.';
        paymentBeforeDelivery = true;
      } else {
        deliveryFee = 500;
        paymentInstruction = 'Delivery fee is 500 Ksh outside Nairobi for orders below or equal to 10,000 Ksh. Payment required before delivery.';
        paymentBeforeDelivery = true;
      }
    }
    
    const totalAmount = cartTotal + deliveryFee;
    console.log('Final total amount for payment:', totalAmount);
    
    if (totalAmount <= 0) {
      throw new BadRequestException(`Invalid total amount: ${totalAmount}. Cart total: ${cartTotal}, Delivery fee: ${deliveryFee}`);
    }

    // If payment before delivery is required, initiate Pesapal payment and return payment URL
    if (paymentBeforeDelivery) {
      const reference = `ORDER-${Date.now()}`;
      try {
        const pesapalResult = await this.paymentService.initiatePesapalPayment({
          amount: totalAmount,
          currency: 'KES',
          description: 'Order Payment',
          email: createOrderDto.guestEmail ?? '',
          phone: createOrderDto.guestPhone ?? '',
          reference,
          callback_url: process.env.PESAPAL_CALLBACK_URL || '',
          provider: 'mpesa',
          metadata: {
            firstName: createOrderDto.guestEmail?.split('@')[0] || '',
            lastName: '',
          },
        });
        // Return payment URL to frontend, do not create order yet
        const paymentUrl =
          pesapalResult.paymentUrl ||
          `https://pay.pesapal.com/iframe/PesapalIframe3/Index/?OrderTrackingId=${reference}`;
        return {
          paymentRequired: true,
          paymentUrl,
          message: 'Payment required before delivery. Please complete payment to confirm your order.',
          deliveryFee,
          paymentInstruction,
        };
      } catch (error) {
        console.error('Pesapal payment initiation failed:', error);
        // Return payment required but with fallback instructions
        return {
          paymentRequired: true,
          paymentUrl: `https://pay.pesapal.com/iframe/PesapalIframe3/Index/?OrderTrackingId=${reference}`,
          message: 'Payment required before delivery. Please complete payment to confirm your order.',
          deliveryFee,
          paymentInstruction,
        };
      }
    }

    // Insert order (for payment after delivery)
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        userId: createOrderDto.userId ?? null,
        status: createOrderDto.status || 'pending',
        total: totalAmount,
        guestEmail: createOrderDto.guestEmail ?? null,
        guestAddress: createOrderDto.guestAddress ?? null,
        guestPhone: createOrderDto.guestPhone ?? null,
        deliveryFee,
        paymentInstruction,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) throw new BadRequestException(orderError.message);

    // Insert order items
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const itemsToInsert = createOrderDto.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));
      const { error: itemsError } = await supabase
        .from('OrderItem')
        .insert(itemsToInsert);
      if (itemsError) throw new BadRequestException(itemsError.message);
    }

    // Notify buyer and admin
    const orderRef = order.id;
    const adminContact = { email: 'uniconnect693@gmail.com', phone: '' };
    const buyerContact = { email: order.guestEmail || '', phone: order.guestPhone || '' };
    await this.notificationService.sendOrderConfirmation(buyerContact, { orderRef }, false);
    await this.notificationService.sendOrderConfirmation(adminContact, { orderRef }, true);

    return order;
  }

  async checkout(userId: string, paymentProvider: string, guestInfo?: { email: string; address: string; phone: string }) {
    const cart = await this.cartService.findOne(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty or not found');
    }

    let total = 0;
    for (const item of cart.items) {
      total += item.quantity * item.product.price;
    }

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        userId: userId,
        status: 'pending',
        total,
        guestEmail: guestInfo?.email,
        guestAddress: guestInfo?.address,
        guestPhone: guestInfo?.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) throw new BadRequestException(orderError.message);

    // Insert order items
    const orderItems = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));
    if (orderItems.length > 0) {
      const { error: itemsError } = await supabase
        .from('OrderItem')
        .insert(orderItems);
      if (itemsError) throw new BadRequestException(itemsError.message);
    }

    await this.paymentService.create({
      orderId: order.id,
      firstName: '',
      lastName: '',
      email: order.guestEmail || '',
      phone: order.guestPhone || '',
      provider: paymentProvider,
      amount: total,
      status: 'pending',
      reference: `REF-${Date.now()}-${order.id}`,
    });

    await this.cartService.remove(cart.id);

    // Notify buyer and admin
    const orderRef = order.id;
    const adminContact = { email: 'uniconnect693@gmail.com', phone: '' };
    const buyerContact = { email: order.guestEmail || '', phone: order.guestPhone || '' };
    await this.notificationService.sendOrderConfirmation(buyerContact, { orderRef }, false);
    await this.notificationService.sendOrderConfirmation(adminContact, { orderRef }, true);

    return order;
  }

  async findAll() {
    const { data, error } = await supabase.from('Order').select('*');
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await supabase
      .from('Order')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { userId, items, ...rest } = updateOrderDto;

    // Update order
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .update({
        ...rest,
        userId: userId === undefined ? null : userId,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (orderError) throw new BadRequestException(orderError.message);

    // Update order items: delete all and re-insert
    if (items) {
      const { error: deleteError } = await supabase
        .from('OrderItem')
        .delete()
        .eq('orderId', id);
      if (deleteError) throw new BadRequestException(deleteError.message);

      if (items.length > 0) {
        const itemsToInsert = items.map((item) => ({
          orderId: id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        }));
        const { error: insertError } = await supabase
          .from('OrderItem')
          .insert(itemsToInsert);
        if (insertError) throw new BadRequestException(insertError.message);
      }
    }

    // Notify buyer of status update
    const buyerContact = { email: order.guestEmail || '', phone: order.guestPhone || '' };
    if (rest.status) {
      await this.notificationService.sendOrderStatusUpdate(buyerContact, order.id, rest.status);
    }

    return order;
  }

  async remove(id: string) {
    // Delete order items first
    const { error: itemsError } = await supabase
      .from('OrderItem')
      .delete()
      .eq('orderId', id);
    if (itemsError) throw new BadRequestException(itemsError.message);

    // Delete order
    const { data, error } = await supabase
      .from('Order')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }
}
