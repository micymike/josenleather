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
    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        userId: createOrderDto.userId ?? null,
        status: createOrderDto.status || 'pending',
        total: createOrderDto.total,
        guestEmail: createOrderDto.guestEmail ?? null,
        guestAddress: createOrderDto.guestAddress ?? null,
        guestPhone: createOrderDto.guestPhone ?? null,
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
