export class Order {
  id: string;
  userId?: string;
  items: { productId: string; quantity: number; price: number }[];
  status: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
