export class Payment {
  id: string;
  orderId: string;
  provider: string;
  status: string;
  reference: string;
  amount: number;
  paidAt?: Date;
}
