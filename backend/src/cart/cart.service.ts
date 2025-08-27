import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto) {
    const { userId, items } = createCartDto;
    return this.prisma.cart.create({
      data: {
        userId,
        items: {
          create: items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.cart.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const { items, userId } = updateCartDto;
    return this.prisma.cart.update({
      where: { id },
      data: {
        userId,
        items: {
          deleteMany: {}, // Clear existing items
          create: items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });
  }

  async remove(id: string) {
    await this.prisma.cartItem.deleteMany({ where: { cartId: id } });
    return this.prisma.cart.delete({ where: { id } });
  }

  async addItem(cartId: string, productId: string, quantity: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId,
          productId,
          quantity,
        },
      });
    }
  }

  async removeItem(cartId: string, productId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const itemToRemove = cart.items.find((item) => item.productId === productId);

    if (itemToRemove) {
      return this.prisma.cartItem.delete({
        where: { id: itemToRemove.id },
      });
    } else {
      throw new Error('Item not found in cart');
    }
  }
}
