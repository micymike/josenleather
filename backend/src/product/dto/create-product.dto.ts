import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  name: string;

  @ApiProperty({ description: 'Product description' })
  description: string;

  @ApiProperty({ description: 'Product price', type: Number })
  price: number;

  @ApiProperty({ description: 'Array of product image URLs', type: [String] })
  imageUrls: string[];

  @ApiProperty({ description: 'SEO title', required: false })
  seoTitle?: string;

  @ApiProperty({ description: 'SEO description', required: false })
  seoDesc?: string;

  @ApiProperty({ description: 'Array of meta tags', type: [String], required: false })
  metaTags?: string[];
}
