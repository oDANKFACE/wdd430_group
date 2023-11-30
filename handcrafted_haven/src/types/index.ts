import { DefaultUser } from 'next-auth';

export interface SessionUser extends DefaultUser {
  role: string;
  id: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    sellerProfile: SellerProfile;
}

export interface Artist {
  id: string;
  firstName?: string;
  lastName?: string;
  sellerProfile?: SellerProfile | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SellerProfile {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  bio?: string | null;
  userId?: string;
  products?: Product[];
}

export interface Product {
  id?: string;
  name?: string;
  description?: string | null;
  price?: number;
  images?: string[];
  category?: string;
  sellerId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  authorEmail: string;
  productId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
