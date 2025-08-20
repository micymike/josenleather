export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  seoTitle?: string;
  seoDesc?: string;
  metaTags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
