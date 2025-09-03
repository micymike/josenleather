import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ArrayMaxSize, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Product price', type: Number })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Product stock', type: Number })
  @IsNumber()
  stock: number;

  @ApiProperty({ description: 'Product category' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Array of product image URLs (max 5)', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @IsUrl({ require_tld: false }, { each: true })
  imageUrls: string[];

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

  @ApiProperty({ description: 'Array of meta tags', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaTags?: string[];
}
