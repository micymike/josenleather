import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ description: 'Product name', required: false })
  name?: string;

  @ApiProperty({ description: 'Product description', required: false })
  description?: string;

  @ApiProperty({ description: 'Product price', type: Number, required: false })
  price?: number;

  @ApiProperty({ description: 'Array of product image URLs', type: [String], required: false })
  imageUrls?: string[];

  @ApiProperty({ description: 'SEO title', required: false })
  seoTitle?: string;

  @ApiProperty({ description: 'SEO description', required: false })
  seoDesc?: string;

  @ApiProperty({ description: 'Array of meta tags', type: [String], required: false })
  metaTags?: string[];
}
