export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  expiryAt: string; // ISO string
  category: string;
}

export interface Story {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
}
