export class Payment {
  id: string;
  orderId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  provider: string;
  status: string;
  reference: string;
  amount: number;
  paidAt?: Date;
  metadata?: any; // Pesapal transaction details
  callbackData?: any; // IPN/webhook payload
}
