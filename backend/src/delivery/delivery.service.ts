import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { supabase } from '../supabase/supabase.client';

@Injectable()
export class DeliveryService {
  constructor() {}

  // Shipping calculation logic
  private calculateShippingCost(goodsValueUSD: number, destinationCity: string, destinationCountry: string): number | null {
    if (goodsValueUSD > 700) {
      return 0;
    }
    if (destinationCountry.trim().toLowerCase() !== 'kenya') {
      return null;
    }
    const nairobiCities = ['nairobi', 'nairobi metropolis', 'nairobi metropolitan'];
    if (nairobiCities.includes(destinationCity.trim().toLowerCase())) {
      return 300;
    }
    return 500;
  }

  async create(createDeliveryDto: CreateDeliveryDto) {
    const history = [
      {
        status: createDeliveryDto.status || 'pending',
        timestamp: new Date().toISOString(),
        location: createDeliveryDto.lastLocation || null,
      },
    ];

    let estimatedCost = createDeliveryDto.estimatedCost;
    if (estimatedCost === undefined || estimatedCost === null) {
      const calculated = this.calculateShippingCost(
        createDeliveryDto.goodsValueUSD,
        createDeliveryDto.destinationCity,
        createDeliveryDto.destinationCountry
      );
      estimatedCost = calculated !== null && calculated !== undefined ? calculated : 0;
    }

    const { data, error } = await supabase
      .from('delivery')
      .insert([{
        ...createDeliveryDto,
        status: createDeliveryDto.status || 'pending',
        estimatedCost: estimatedCost,
        deliveryHistory: history,
      }])
      .select()
      .single();

    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
    // Fetch current delivery
    const { data: delivery, error: findError } = await supabase
      .from('delivery')
      .select('*')
      .eq('id', id)
      .single();
    if (findError || !delivery) throw new NotFoundException('Delivery not found');

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

    const { data: updatedDelivery, error: updateError } = await supabase
      .from('delivery')
      .update({
        ...updateDeliveryDto,
        status: updateDeliveryDto.status || delivery.status,
        deliveryHistory: newHistory,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw new NotFoundException(updateError.message);

    // Fetch order and get recipient email from contact details
    let receiver_email = null;
    try {
      const { data: order, error: orderError } = await supabase
        .from('order')
        .select('*')
        .eq('id', delivery.orderId)
        .single();
      if (!orderError && order && order.guestEmail) {
        receiver_email = order.guestEmail;
      }
    } catch (err) {
      console.error('Error fetching recipient email:', err);
    }

    if (receiver_email) {
      const nodemailer = require('nodemailer');
      const smtp_server = 'smtp.gmail.com';
      const port = 587;
      const smtp_username = 'uniconnect693@gmail.com';
      const password = 'kdxlnpqemrkrnusi';

      const sender_email = smtp_username;
      const subject = 'Delivery Status Updated';
      const body = `Your delivery status has been updated to: ${updateDeliveryDto.status || delivery.status}`;

      const transporter = nodemailer.createTransport({
        host: smtp_server,
        port: port,
        secure: false,
        auth: {
          user: smtp_username,
          pass: password,
        },
      });

      const mailOptions = {
        from: sender_email,
        to: receiver_email,
        subject: subject,
        text: body,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    } else {
      console.warn('No recipient email found for delivery notification.');
    }

    return updatedDelivery;
  }

  async findByTrackingCode(trackingCode: string) {
    const { data: delivery, error } = await supabase
      .from('delivery')
      .select('*')
      .eq('trackingCode', trackingCode)
      .single();
    if (error || !delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }

  async findByOrderId(orderId: string) {
    const { data: delivery, error } = await supabase
      .from('delivery')
      .select('*')
      .eq('orderId', orderId)
      .single();
    if (error || !delivery) throw new NotFoundException('Delivery not found');
    return delivery;
  }
}
