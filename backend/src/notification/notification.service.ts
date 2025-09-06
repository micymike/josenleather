import { Injectable, Logger } from '@nestjs/common';
/* Twilio removed */
import * as africastalking from 'africastalking';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  /* Twilio removed */
  private atSms: africastalking.SMS;
  private mailTransporter: nodemailer.Transporter;

  constructor() {
    // Twilio removed

    // Africa's Talking setup
    const at = africastalking({
      apiKey: process.env.AFRICA_TALKING_API_KEY,
      username: process.env.AFRICA_TALKING_USERNAME || 'sandbox',
    });
    this.atSms = at.SMS;

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

  async sendOrderConfirmation(
    to: { email: string; phone: string },
    orderDetails: any,
    isAdmin: boolean
  ) {
    const subject = isAdmin
      ? `New Order Received: #${orderDetails.orderRef}`
      : `Order Confirmation: #${orderDetails.orderRef}`;
    const message = isAdmin
      ? `A new order has been placed. Order Ref: ${orderDetails.orderRef}.`
      : `Thank you for your order! Your order reference is ${orderDetails.orderRef}.`;

    // Send SMS
    if (to.phone) {
      try {
        await this.atSms.send({
          to: [to.phone],
          message,
          // from: process.env.AFRICA_TALKING_SHORTCODE, // optional, use shared shortcode if not set
        });
      } catch (e) {
        this.logger.error('Failed to send SMS via Africa\'s Talking', e);
      }
    }

    // Send Email
    if (to.email) {
      try {
        await this.mailTransporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@josenleather.com',
          to: to.email,
          subject,
          text: message,
        });
      } catch (e) {
        this.logger.error('Failed to send email', e);
      }
    }
  }

  async sendOrderStatusUpdate(
    to: { email: string; phone: string },
    orderId: string,
    status: string
  ) {
    const subject = `Order #${orderId} Status Update`;
    const message = `Your order #${orderId} status has been updated: ${status}`;

    // Send SMS
    if (to.phone) {
      try {
        await this.atSms.send({
          to: [to.phone],
          message,
        });
      } catch (e) {
        this.logger.error('Failed to send SMS via Africa\'s Talking', e);
      }
    }

    // Send Email
    if (to.email) {
      try {
        await this.mailTransporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@josenleather.com',
          to: to.email,
          subject,
          text: message,
        });
      } catch (e) {
        this.logger.error('Failed to send email', e);
      }
    }
  }
}
