import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  // Shipping calculation logic
  private calculateShippingCost(goodsValueUSD: number, destinationCity: string, destinationCountry: string): number | null {
    // Free shipping globally for goods above $700
    if (goodsValueUSD > 700) {
      return 0;
    }
    // International shipping (outside Kenya): carrier charges apply, not calculated here
    if (destinationCountry.trim().toLowerCase() !== 'kenya') {
      return null;
    }
    // Nairobi/metropolis
    const nairobiCities = ['nairobi', 'nairobi metropolis', 'nairobi metropolitan'];
    if (nairobiCities.includes(destinationCity.trim().toLowerCase())) {
      return 300;
    }
    // Within Kenya, outside Nairobi
    return 500;
  }

  async create(createDeliveryDto: CreateDeliveryDto) {
    // Initialize deliveryHistory with the initial status
    const history = [
      {
        status: createDeliveryDto.status || 'pending',
        timestamp: new Date().toISOString(),
        location: createDeliveryDto.lastLocation || null,
      },
    ];

    // Calculate shipping cost if not provided
    let estimatedCost = createDeliveryDto.estimatedCost;
    if (estimatedCost === undefined || estimatedCost === null) {
      const calculated = this.calculateShippingCost(
        createDeliveryDto.goodsValueUSD,
        createDeliveryDto.destinationCity,
        createDeliveryDto.destinationCountry
      );
      // If calculated is null (international), set to 0 (carrier charges apply)
      estimatedCost = calculated !== null && calculated !== undefined ? calculated : 0;
    }

    return this.prisma.delivery.create({
      data: {
        ...createDeliveryDto,
        status: createDeliveryDto.status || 'pending',
        estimatedCost: estimatedCost,
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
