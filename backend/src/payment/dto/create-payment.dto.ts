export class CreatePaymentDto {
  orderId: string;
  provider: string; // paystack, mpesa, card
  status: string;   // pending, confirmed, failed
  reference: string;
  amount: number;
  paidAt?: Date;
}
