export class CreateCartDto {
  userId?: string;
  items?: { productId: string; quantity: number }[];
}
