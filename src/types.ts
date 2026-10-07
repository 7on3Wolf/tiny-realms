export type ArtworkStatus = 'Available' | 'Sold' | 'Reserved' | 'Archived';
export type CollectionStatus = 'Active' | 'Archived';
export type ArtworkCategory =
  | 'Digital Character'
  | 'Anime Illustration'
  | 'Concept Art'
  | 'Portrait'
  | 'Fantasy'
  | 'Other';

export const ARTWORK_CATEGORIES: ArtworkCategory[] = [
  'Digital Character',
  'Anime Illustration',
  'Concept Art',
  'Portrait',
  'Fantasy',
  'Other',
];

export interface Artwork {
  id: string;
  code: string;
  title: string;
  description: string;
  image: string;
  collectionId: string;
  collection: string;
  year: number;
  category: string;
  status: ArtworkStatus;
  nftUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional metadata for public gallery backwards-compatibility
  subtitle?: string;
  longDescription?: string;
  platform?: string;
  edition?: string;
  dimensions?: string;
  tokenId?: string;
  contractAddress?: string;
  isFeatured?: boolean;
  medium?: string;
  tags?: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  year: number;
  status: CollectionStatus;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtworkFormData {
  title: string;
  image: string;
  dimensions?: string;
  status: ArtworkStatus;
  published: boolean;
  nftUrl: string;
  code?: string;
  description?: string;
  collectionId?: string;
  collection?: string;
  year?: number;
  category?: string;
  isFeatured?: boolean;
  tags?: string[];
}

export interface ArtworkFilter {
  searchQuery?: string;
  status?: 'All' | ArtworkStatus;
  published?: 'All' | 'Published' | 'Draft';
  collection?: string;
  category?: string;
  sortBy?: 'Newest' | 'Oldest' | 'Title A-Z' | 'Title Z-A' | 'Year Newest' | 'Year Oldest';
}

export interface ArtistProfile {
  name: string;
  handle: string;
  role: string;
  bio: string;
  statement: string;
  avatar: string;
  location: string;
  socialLinks: {
    label: string;
    url: string;
    platform: 'instagram' | 'x' | 'website' | 'foundation' | 'opensea';
  }[];
  stats: {
    label: string;
    sublabel?: string;
    value: string;
  }[];
}
