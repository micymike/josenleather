import { NotificationService } from '../src/notification/notification.service';
import * as nodemailer from 'nodemailer';
import { sendNotification } from '../src/lib/firebase-admin';

jest.mock('nodemailer');
jest.mock('../src/lib/firebase-admin', () => ({
  sendNotification: jest.fn(),
}));

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    // Mock nodemailer transport
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({}),
    });
    supabaseService = {
      // Mock SupabaseService methods as needed
    } as SupabaseService;
    service = new NotificationService(supabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send order confirmation notification', async () => {
    const userFcmToken = 'test-token';
    const orderDetails = { id: 1, orderRef: 'ORD123' };
    (sendNotification as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.sendOrderConfirmation(userFcmToken, orderDetails);

    expect(sendNotification).toHaveBeenCalledWith(
      [userFcmToken],
      'Order Confirmed ✅',
      'Your order #ORD123 was placed successfully',
      expect.objectContaining({
        type: 'ORDER_CONFIRMATION',
        orderId: 1,
        orderRef: 'ORD123',
        status: 'confirmed',
      })
    );
    expect(result.success).toBe(true);
  });

  it('should handle missing FCM token in sendOrderConfirmation', async () => {
    const result = await service.sendOrderConfirmation('', { id: 1, orderRef: 'ORD123' });
    expect(result.success).toBe(false);
    expect(result.error).toBe('No FCM token available');
  });

  it('should send order status update notification', async () => {
    const userFcmToken = 'test-token';
    const orderDetails = { id: 2, orderRef: 'ORD456' };
    (sendNotification as jest.Mock).mockResolvedValueOnce(true);

    const result = await service.sendOrderStatusUpdate(userFcmToken, orderDetails, 'shipped');

    expect(sendNotification).toHaveBeenCalledWith(
      [userFcmToken],
      'Order Shipped 🚚',
      'Your order #ORD456 has been shipped',
      expect.objectContaining({
        type: 'ORDER_STATUS_UPDATE',
        orderId: 2,
        orderRef: 'ORD456',
        status: 'shipped',
      })
    );
    expect(result.success).toBe(true);
  });

  it('should handle missing FCM token in sendOrderStatusUpdate', async () => {
    const result = await service.sendOrderStatusUpdate('', { id: 2, orderRef: 'ORD456' }, 'shipped');
    expect(result.success).toBe(false);
    expect(result.error).toBe('No FCM token available');
  });

  it('should handle errors in sendOrderConfirmation', async () => {
    (sendNotification as jest.Mock).mockRejectedValueOnce(new Error('FCM error'));
    const userFcmToken = 'test-token';
    const orderDetails = { id: 3, orderRef: 'ORD789' };

    const result = await service.sendOrderConfirmation(userFcmToken, orderDetails);

    expect(result.success).toBe(false);
    expect(result.error).toBe('FCM error');
  });
});
