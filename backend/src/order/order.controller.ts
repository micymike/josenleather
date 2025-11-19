import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Guest checkout (open)
@Post()
create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
  // LOG: Raw request body
  // eslint-disable-next-line no-console
  console.log('POST /orders RAW BODY:', JSON.stringify(req.body, null, 2));
  // LOG: Mapped DTO
  // eslint-disable-next-line no-console
  console.log('POST /orders DTO:', JSON.stringify(createOrderDto, null, 2));
    // If userId is provided, reject (should use /secure endpoint)
    if (createOrderDto.userId) {
      // eslint-disable-next-line no-console
      console.error('Order rejected: userId provided in guest checkout');
      throw new Error('Registered users must use /orders/secure endpoint');
    }
    // Require guest info
    if (!createOrderDto.guestEmail || !createOrderDto.guestAddress) {
      // eslint-disable-next-line no-console
      console.error('Order rejected: missing guestEmail or guestAddress', createOrderDto);
      throw new Error('Guest email and address are required for guest checkout');
    }
    try {
      return this.orderService.create(createOrderDto);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('OrderService.create error:', err);
      throw err;
    }
  }

  // Registered user checkout (secure)
  @UseGuards(JwtAuthGuard)
  @Post('secure')
  createSecure(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    // Attach userId from JWT payload
    const user = req['user'];
    if (!user || !user.sub) {
      throw new Error('Authenticated user not found');
    }
    createOrderDto.userId = user.sub;
    // Remove guest info if present
    createOrderDto.guestEmail = undefined;
    createOrderDto.guestAddress = undefined;
    createOrderDto.guestPhone = undefined;
    return this.orderService.create(createOrderDto);
  }

  
  // Admin: get all orders
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  // Admin: get order by id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // Admin: update order
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  // Admin: delete order
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
