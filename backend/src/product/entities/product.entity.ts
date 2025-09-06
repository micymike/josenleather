export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  category: string;
  productType: string;
  class: string;
  subClass: string;
  material: string;
  seoTitle?: string;
  seoDesc?: string;
  metaTags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
