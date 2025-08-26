import { Controller, Post, Patch, Get, Param, Body, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  // Admin: Create a delivery
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  // Admin: Update delivery (status, location, etc.)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeliveryDto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, updateDeliveryDto);
  }

  // Public: Get tracking info by tracking code
  @Get('track/:trackingCode')
  trackByCode(@Param('trackingCode') trackingCode: string) {
    return this.deliveryService.findByTrackingCode(trackingCode);
  }

  // Public: Get tracking info by orderId
  @Get('order/:orderId')
  trackByOrder(@Param('orderId') orderId: string) {
    return this.deliveryService.findByOrderId(orderId);
  }
}
