import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { sendNotification } from '../lib/firebase-admin';
import { SupabaseService } from '../supabase/supabase.client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private mailTransporter: nodemailer.Transporter;
  private readonly supabaseService: SupabaseService;

  constructor(supabaseService: SupabaseService) {
    this.supabaseService = supabaseService;
    // Nodemailer setup (use your SMTP or a transactional email service)
    this.mailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send a test push notification to a given FCM token
   */
  async sendTestNotification(fcmToken: string, title: string, message: string, data: any) {
    try {
      if (!fcmToken) {
        this.logger.warn('No FCM token provided for test notification');
        return { success: false, error: 'No FCM token provided' };
      }
      await sendNotification(
        [fcmToken],
        title,
        message,
        {
          type: 'TEST_NOTIFICATION',
          ...data,
          timestamp: new Date().toISOString()
        }
      );
      return { success: true };
    } catch (error) {
      this.logger.error('Error in sendTestNotification:', error);
      return { success: false, error: error.message };
    }
  }
  /**
   * Send push notification to admins about new order
   */
  async notifyAdminsNewOrder(orderDetails: any) {
    try {
      // Get admin FCM tokens from your admin service
      const adminTokens = await this.getAdminFcmTokens();
      
      if (adminTokens && adminTokens.length > 0) {
        await sendNotification(
          adminTokens,
          'New Order Placed 🛒',
          `Order #${orderDetails.orderRef} has been placed`,
          { 
            type: 'NEW_ORDER',
            orderId: orderDetails.id,
            orderRef: orderDetails.orderRef,
            timestamp: new Date().toISOString()
          }
        );
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Error in notifyAdminsNewOrder:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order confirmation to customer
   */
  async sendOrderConfirmation(userFcmToken: string, orderDetails: any) {
    try {
      if (!userFcmToken) {
        this.logger.warn('No FCM token for user, skipping push notification');
        return { success: false, error: 'No FCM token available' };
      }

      await sendNotification(
        [userFcmToken],
        'Order Confirmed ✅',
        `Your order #${orderDetails.orderRef} was placed successfully`,
        {
          type: 'ORDER_CONFIRMATION',
          orderId: orderDetails.id,
          orderRef: orderDetails.orderRef,
          status: 'confirmed',
          timestamp: new Date().toISOString()
        }
      );

      return { success: true };
    } catch (error) {
      this.logger.error('Error in sendOrderConfirmation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order status update to customer
   */
  async sendOrderStatusUpdate(userFcmToken: string, orderDetails: any, status: string) {
    try {
      if (!userFcmToken) {
        this.logger.warn('No FCM token for user, skipping status update notification');
        return { success: false, error: 'No FCM token available' };
      }

      const statusMessages = {
        processing: {
          title: 'Order Processing ⚙️',
          message: `Your order #${orderDetails.orderRef} is being processed`
        },
        shipped: {
          title: 'Order Shipped 🚚',
          message: `Your order #${orderDetails.orderRef} has been shipped`
        },
        delivered: {
          title: 'Order Delivered 🎉',
          message: `Your order #${orderDetails.orderRef} has been delivered`
        },
        cancelled: {
          title: 'Order Cancelled ❌',
          message: `Your order #${orderDetails.orderRef} has been cancelled`
        }
      };

      const { title, message } = statusMessages[status] || {
        title: 'Order Updated',
        message: `Your order #${orderDetails.orderRef} status has been updated to ${status}`
      };

      await sendNotification(
        [userFcmToken],
        title,
        message,
        {
          type: 'ORDER_STATUS_UPDATE',
          orderId: orderDetails.id,
          orderRef: orderDetails.orderRef,
          status,
          timestamp: new Date().toISOString()
        }
      );

      return { success: true };
    } catch (error) {
      this.logger.error('Error in sendOrderStatusUpdate:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Helper method to get admin FCM tokens
   * Replace this with your actual implementation
   */
  private async getAdminFcmTokens(): Promise<string[]> {
    // Fetch admin FCM tokens from auth table using Supabase
    const { data, error } = await this.supabaseService.client
      .from('User')
      .select('fcm_token')
      .eq('role', 'admin')
      .not('fcm_token', 'is', null);

    if (error) {
      this.logger.error('Error fetching admin FCM tokens:', error);
      return [];
    }
    // Return array of non-null tokens
    return (data || [])
      .map((row: { fcm_token?: string }) => row.fcm_token)
      .filter((token): token is string => typeof token === 'string');
  }

}
