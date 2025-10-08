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
  sizes?: number[]; // Available sizes for belts (in inches)
  seoTitle?: string;
  seoDesc?: string;
  metaTags?: string[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}
