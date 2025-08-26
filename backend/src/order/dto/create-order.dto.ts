export class CreateOrderDto {
  userId?: string;
  items: { productId: string; quantity: number; price: number }[];
  status?: string;
  total: number;
  // Guest checkout fields
  guestEmail?: string;
  guestAddress?: string;
  guestPhone?: string;
}
