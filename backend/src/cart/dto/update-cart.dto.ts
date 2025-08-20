export class UpdateCartDto {
  userId?: string;
  items?: { productId: string; quantity: number }[];
}
