export class CreateOrderDto {
  userId?: string;
  items: { productId: string; quantity: number; price: number }[];
  status?: string;
  total: number;
}
