export class CreateProductDto {
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  seoTitle?: string;
  seoDesc?: string;
  metaTags?: string[];
}
