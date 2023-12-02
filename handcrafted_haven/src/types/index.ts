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
  firstName: string;
  lastName: string;
  sellerProfile?: SellerProfile | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SellerProfile {
  id: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  bio?: string | null;
  user: User;
  userId: string;
  products?: Product[];
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  images?: string[];
  category: string;
  seller: SellerProfile;
  sellerId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  reviews?: Review[];
}

export interface Review {
  id?: string;
  rating: number;
  comment?: string;
  product?: Product;
  productId?: string;
  author?: User;
  authorId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  sellerProfile?: SellerProfile;
  sellerProfileId?: string;
}

export interface SearchArtistProps {
  artist: string;
  artistName?: Artist[];
  setArtist: (artist: string) => void;
}

export interface CustomFilterProps {
  title: string;
  option: string[];
}

