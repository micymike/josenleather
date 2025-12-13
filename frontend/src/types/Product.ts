export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  rating?: number; // Make optional for compatibility
  category: string;
  imageUrls: string[];
  // Add other fields as needed
}
