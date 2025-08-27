import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        userId: createOrderDto.userId ?? null,
        status: createOrderDto.status || 'pending',
        total: createOrderDto.total,
        guestEmail: createOrderDto.guestEmail ?? null,
        guestAddress: createOrderDto.guestAddress ?? null,
        guestPhone: createOrderDto.guestPhone ?? null,
        items: {
          create: createOrderDto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
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

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = await this.prisma.order.create({
      data: {
        userId: userId,
        status: 'pending',
        total,
        guestEmail: guestInfo?.email,
        guestAddress: guestInfo?.address,
        guestPhone: guestInfo?.phone,
        items: {
          create: orderItems,
        },
      },
    });

    await this.paymentService.create({
      orderId: order.id,
      provider: paymentProvider,
      amount: total,
      status: 'pending',
      reference: `REF-${Date.now()}-${order.id}`, // Generate a unique reference
    });

    await this.cartService.remove(cart.id); // Clear the cart

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany();
   // return 'This action returns all orders';
  }

  async findOne(id: string) {
   return this.prisma.order.findUnique({ where: { id } });
  //  return `This action returns order #${id}`;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { userId, items, ...rest } = updateOrderDto;
    return this.prisma.order.update({
      where: { id },
      data: {
        ...rest,
        userId: userId === undefined ? null : userId,
        items: {
          deleteMany: {},
          create: items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
  }

  async remove(id: string) {
     return this.prisma.order.delete({ where: { id } });
   // return `This action removes order #${id}`;
  }
}
