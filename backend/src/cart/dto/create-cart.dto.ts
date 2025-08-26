import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty({ description: 'Product ID' })
  productId: string;

  @ApiProperty({ description: 'Quantity of the product', type: Number })
  quantity: number;
}

export class CreateCartDto {
  @ApiProperty({ description: 'User ID', required: false })
  userId?: string;

  @ApiProperty({ description: 'Array of cart items', type: [ItemDto], required: false })
  items?: ItemDto[];
}
