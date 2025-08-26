import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    // Initialize deliveryHistory with the initial status
    const history = [
      {
        status: createDeliveryDto.status || 'pending',
        timestamp: new Date().toISOString(),
        location: createDeliveryDto.lastLocation || null,
      },
    ];
    return this.prisma.delivery.create({
      data: {
        ...createDeliveryDto,
        status: createDeliveryDto.status || 'pending',
        estimatedCost: createDeliveryDto.estimatedCost ?? 0,
        deliveryHistory: history as unknown as object, // ensure JSON
      },
    });
  }

  async update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
    // Fetch current delivery
    const delivery = await this.prisma.delivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundException('Delivery not found');

    // Update deliveryHistory if status or location changes
    let newHistory: any[] = Array.isArray(delivery.deliveryHistory) ? delivery.deliveryHistory : [];
    if (
      (updateDeliveryDto.status && updateDeliveryDto.status !== delivery.status) ||
      (updateDeliveryDto.lastLocation && updateDeliveryDto.lastLocation !== delivery.lastLocation)
    ) {
      newHistory = [
        ...newHistory,
        {
          status: updateDeliveryDto.status || delivery.status,
          timestamp: new Date().toISOString(),
          location: updateDeliveryDto.lastLocation || delivery.lastLocation || null,
        },
      ];
    }

    return this.prisma.delivery.update({
      where: { id },
      data: {
        ...updateDeliveryDto,
        status: updateDeliveryDto.status || delivery.status,
        deliveryHistory: newHistory as unknown as object,
      },
    });
  }

  async findByTrackingCode(trackingCode: string) {
    const delivery = await this.prisma.delivery.findFirst({ where: { trackingCode } });
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async findByOrderId(orderId: string) {
    const delivery = await this.prisma.delivery.findUnique({ where: { orderId } });
    if (!delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }
}
