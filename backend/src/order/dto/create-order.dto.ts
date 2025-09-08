import { IsOptional, IsString, IsArray, IsNumber, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsNumber()
  total: number;

  // Guest checkout fields
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsString()
  guestAddress?: string;

  @IsOptional()
  @IsString()
  guestPhone?: string;
}
