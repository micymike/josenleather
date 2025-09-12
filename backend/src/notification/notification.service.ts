import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private mailTransporter: nodemailer.Transporter;

  constructor() {
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
   * Send a push notification to admin(s) using OneSignal when a new order is created.
   * @param orderDetails - The order details object
   */
  async sendAdminPushNotification(orderDetails: any) {
    const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
    const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
      this.logger.warn('OneSignal credentials not set. Push notification skipped.');
      return;
    }
    const payload = {
      app_id: ONESIGNAL_APP_ID,
      headings: { en: "New Order Received" },
      contents: { en: `Order #${orderDetails.orderRef} placed. Check admin dashboard for details.` },
      included_segments: ["Admins"], // You can use tags or segments to target admin users
      url: "https://www.josenleather.com/admin/orders",
      data: { orderRef: orderDetails.orderRef },
    };
    try {
      const res = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${ONESIGNAL_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        this.logger.error("Failed to send OneSignal push notification", await res.text());
      } else {
        this.logger.log("Admin push notification sent via OneSignal");
      }
    } catch (e) {
      this.logger.error("Error sending OneSignal push notification", e);
    }
  }

  async sendOrderConfirmation(
    to: { email: string },
    orderDetails: any,
    isAdmin: boolean
  ) {
    const subject = isAdmin
      ? `New Order Received: #${orderDetails.orderRef}`
      : `Order Confirmation: #${orderDetails.orderRef}`;
    const message = isAdmin
      ? `A new order has been placed. Order Ref: ${orderDetails.orderRef}.`
      : `Thank you for your order! Your order reference is ${orderDetails.orderRef}.`;

    // Send Email
    if (to.email) {
      try {
        await this.mailTransporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@josenleather.com',
          to: to.email,
          subject,
          text: message,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #fffbe6; border-radius: 16px; border: 1px solid #ffe0b2; padding: 32px; max-width: 480px; margin: 24px auto;">
              <img src="https://www.josenleather.com/public/logo.jpg" alt="Josen Leather Logo" style="height: 48px; margin-bottom: 16px;" />
              <h2 style="color: #d97706; font-size: 1.5rem; margin-bottom: 8px;">Order Received!</h2>
              <p style="color: #444; font-size: 1rem; margin-bottom: 16px;">
                Thank you for your order!<br>
                Your order reference is <b style="color: #256029;">${orderDetails.orderRef}</b>.<br>
                Your order has been received and is being processed.<br>
                Please check your email for tracking information.
              </p>
              <div style="margin: 24px 0;">
                <h3 style="color: #b45309; font-size: 1.1rem; margin-bottom: 8px;">Order Tracking</h3>
                <div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
                  <div style="text-align: center;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#d97706;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;">1</div>
                    <div style="font-size:0.85rem;color:#d97706;margin-top:4px;">Received</div>
                  </div>
                  <div style="width:48px;height:4px;background:#d97706;"></div>
                  <div style="text-align: center;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#ffe0b2;color:#b45309;display:flex;align-items:center;justify-content:center;font-weight:bold;">2</div>
                    <div style="font-size:0.85rem;color:#b45309;margin-top:4px;">Processing</div>
                  </div>
                  <div style="width:48px;height:4px;background:#ffe0b2;"></div>
                  <div style="text-align: center;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#ffe0b2;color:#b45309;display:flex;align-items:center;justify-content:center;font-weight:bold;">3</div>
                    <div style="font-size:0.85rem;color:#b45309;margin-top:4px;">Shipped</div>
                  </div>
                  <div style="width:48px;height:4px;background:#ffe0b2;"></div>
                  <div style="text-align: center;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#ffe0b2;color:#b45309;display:flex;align-items:center;justify-content:center;font-weight:bold;">4</div>
                    <div style="font-size:0.85rem;color:#b45309;margin-top:4px;">Delivered</div>
                  </div>
                </div>
                <p style="margin-top:12px;color:#444;font-size:0.95rem;">
                  Your order is <b style="color:#d97706;">Received</b>.
                </p>
              </div>
              <div style="margin-top: 24px; color: #888; font-size: 0.9rem;">
                Josen Leather & Canvas &mdash; Premium Leather Goods
              </div>
            </div>
          `,
        });
      } catch (e) {
        this.logger.error('Failed to send email', e);
      }
    }
  }

  async sendOrderStatusUpdate(
    to: { email: string },
    orderId: string,
    status: string
  ) {
    const subject = `Order #${orderId} Status Update`;
    const message = `Your order #${orderId} status has been updated: ${status}`;

    // Send Email
    if (to.email) {
      try {
        await this.mailTransporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@josenleather.com',
          to: to.email,
          subject,
          text: message,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #fffbe6; border-radius: 16px; border: 1px solid #ffe0b2; padding: 32px; max-width: 480px; margin: 24px auto;">
              <img src="https://www.josenleather.com/public/logo.jpg" alt="Josen Leather Logo" style="height: 48px; margin-bottom: 16px;" />
              <h2 style="color: #d97706; font-size: 1.5rem; margin-bottom: 8px;">Order Status Update</h2>
              <p style="color: #444; font-size: 1rem; margin-bottom: 16px;">
                Your order <b style="color: #256029;">#${orderId}</b> status has been updated to <b style="color: #d97706;">${status}</b>.
              </p>
              <div style="margin: 24px 0;">
                <h3 style="color: #b45309; font-size: 1.1rem; margin-bottom: 8px;">Order Tracking</h3>
                <div style="display: flex; align-items: center; justify-content: center; gap: 16px;">
                  <div style="text-align: center;">
                    <div style="width:32px;height:32px;border-radius:50%;background:${status === "Received" ? "#d97706" : "#ffe0b2"};color:${status === "Received" ? "#fff" : "#b45309"};display:flex;align-items:center;justify-content:center;font-weight:bold;">1</div>
                    <div style="font-size:0.85rem;color:${status === "Received" ? "#d97706" : "#b45309"};margin-top:4px;">Received</div>
                  </div>
                  <div style="width:48px;height:4px;background:${["Processing", "Shipped", "Delivered"].includes(status) ? "#d97706" : "#ffe0b2"};"></div>
                  <div style="text-align: center;">
                    <div style="width:32px;height:32px;border-radius:50%;background:${status === "Processing" ? "#d97706" : "#ffe0b2"};color:${status === "Processing" ? "#fff" : "#b45309"};display:flex;align-items:center;justify-content:center;font-weight:bold;">2</div>
                    <div style="font-size:0.85rem;color:${status === "Processing" ? "#d97706" : "#b45309"};margin-top:4px;">Processing</div>
                  </div>
                  <div style="width:48px;height:4px;background:${["Shipped", "Delivered"].includes(status) ? "#d97706" : "#ffe0b2"};"></div>
                  <div style="text-align: center;">
                    <div style="width:32px;height:32px;border-radius:50%;background:${status === "Shipped" ? "#d97706" : "#ffe0b2"};color:${status === "Shipped" ? "#fff" : "#b45309"};display:flex;align-items:center;justify-content:center;font-weight:bold;">3</div>
                    <div style="font-size:0.85rem;color:${status === "Shipped" ? "#d97706" : "#b45309"};margin-top:4px;">Shipped</div>
                  </div>
                  <div style="width:48px;height:4px;background:${status === "Delivered" ? "#d97706" : "#ffe0b2"};"></div>
                  <div style="text-align: center;">
                    <div style="width:32px;height:32px;border-radius:50%;background:${status === "Delivered" ? "#d97706" : "#ffe0b2"};color:${status === "Delivered" ? "#fff" : "#b45309"};display:flex;align-items:center;justify-content:center;font-weight:bold;">4</div>
                    <div style="font-size:0.85rem;color:${status === "Delivered" ? "#d97706" : "#b45309"};margin-top:4px;">Delivered</div>
                  </div>
                </div>
                <p style="margin-top:12px;color:#444;font-size:0.95rem;">
                  Your order is currently <b style="color:#d97706;">${status}</b>.
                </p>
              </div>
              <div style="margin-top: 24px; color: #888; font-size: 0.9rem;">
                Josen Leather & Canvas &mdash; Premium Leather Goods
              </div>
            </div>
          `,
        });
      } catch (e) {
        this.logger.error('Failed to send email', e);
      }
    }
  }
}
