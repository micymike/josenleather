export class CreatePaymentDto {
  orderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  provider: string; // paystack, mpesa, card
  status: string;   // pending, confirmed, failed
  reference: string;
  amount: number;
  paidAt?: Date;
  metadata?: any; // Pesapal transaction details
}
