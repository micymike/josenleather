import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    // Store all fields, including guest info if userId is not present
    return this.prisma.order.create({
      data: {
        userId: createOrderDto.userId ?? null,
        items: createOrderDto.items as any, // Adjust type as needed for Prisma schema
        status: createOrderDto.status || 'pending',
        total: createOrderDto.total,
       // guestEmail: createOrderDto.guestEmail ?? null,
        guestAddress: createOrderDto.guestAddress ?? null,
        guestPhone: createOrderDto.guestPhone ?? null,
      },
    });
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
    // Ensure userId is null if undefined to match Prisma expectations
    const { userId, ...rest } = updateOrderDto;
    return this.prisma.order.update({
      where: { id },
      data : {
        ...rest,
        userId: userId === undefined ? null : userId,
      } as any,
    });
   // return `This action updates order #${id}`;
  }

  async remove(id: string) {
     return this.prisma.order.delete({ where: { id } });
   // return `This action removes order #${id}`;
  }
}
