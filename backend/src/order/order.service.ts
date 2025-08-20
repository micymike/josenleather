import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service'; // Uncomment when available
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  // constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    // return this.prisma.order.create({ data: createOrderDto });
    return 'This action creates a new order';
  }

  async findAll() {
    // return this.prisma.order.findMany();
    return 'This action returns all orders';
  }

  async findOne(id: string) {
    // return this.prisma.order.findUnique({ where: { id } });
    return `This action returns order #${id}`;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    // return this.prisma.order.update({ where: { id }, data: updateOrderDto });
    return `This action updates order #${id}`;
  }

  async remove(id: string) {
    // return this.prisma.order.delete({ where: { id } });
    return `This action removes order #${id}`;
  }
}
