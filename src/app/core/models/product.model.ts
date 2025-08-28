export interface Product {
  id: number;
  name: string;
  category: string;
  brand?: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  rating?: number;
}
