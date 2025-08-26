import { ApiProperty } from '@nestjs/swagger';
import { ItemDto } from './create-cart.dto';

export class UpdateCartDto {
  @ApiProperty({ description: 'User ID', required: false })
  userId?: string;

  @ApiProperty({ description: 'Array of cart items', type: [ItemDto], required: false })
  items?: ItemDto[];
}
