import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ArrayMaxSize, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ description: 'Product name', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: 'Product category', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Product description', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ description: 'Product price', type: Number, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  // category removed, use productType only

  @ApiProperty({ description: 'Array of product image URLs (max 5)', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsUrl({ require_tld: false }, { each: true })
  imageUrls?: string[];

  @ApiProperty({ description: 'Optional video URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  videoUrl?: string;

  @ApiProperty({ description: 'SEO title', required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ description: 'SEO description', required: false })
  @IsOptional()
  @IsString()
  seoDesc?: string;

  @ApiProperty({ description: 'Product type', required: false })
  @IsOptional()
  @IsString()
  productType?: string;

  @ApiProperty({ description: 'Product class', required: false })
  @IsOptional()
  @IsString()
  class?: string;

  @ApiProperty({ description: 'Product sub class', required: false })
  @IsOptional()
  @IsString()
  subClass?: string;

  @ApiProperty({ description: 'Product material', required: false })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiProperty({ description: 'Array of meta tags', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaTags?: string[];
}
