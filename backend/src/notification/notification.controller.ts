import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Test endpoint to send a notification
  @Post('test')
  async sendTestNotification(@Body() body: { fcmToken: string, title?: string, message?: string, data?: any }) {
    // fcmToken is required, others are optional
    return this.notificationService.sendTestNotification(
      body.fcmToken,
      body.title || 'Test Notification',
      body.message || 'This is a test notification from /notification/test endpoint.',
      body.data || {}
    );
  }
}
