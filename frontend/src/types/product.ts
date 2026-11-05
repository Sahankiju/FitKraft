export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  thumbnail: string | null;
  featured: boolean;
  category_id: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}