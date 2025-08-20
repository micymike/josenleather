export class Notification {
  id: string;
  userId: string;
  type: 'order_confirmation' | 'order_update' | 'promotion' | 'custom';
  message: string;
  channel: 'email' | 'sms' | 'push';
  status: 'pending' | 'sent' | 'failed';
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}
