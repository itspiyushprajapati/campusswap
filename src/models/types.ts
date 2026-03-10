import type { Condition, ItemStatus, SaleType } from '@prisma/client';

// Re-export enums from Prisma for convenience
export { Condition, ItemStatus, SaleType };

//
// DTOs for Item operations
//

export interface CreateItemInput {
  title: string;
  description?: string;
  price: number;
  condition: Condition;
  categoryId: string;
  images?: string[];
  saleType?: SaleType;
  pickupLocation?: string;
  isUrgent?: boolean;
}

export interface UpdateItemInput {
  title?: string;
  description?: string;
  price?: number;
  condition?: Condition;
  categoryId?: string;
  images?: string[];
  status?: ItemStatus;
  saleType?: SaleType;
  pickupLocation?: string;
  isUrgent?: boolean;
  isSold?: boolean;
}

export interface ItemFilters {
  categoryId?: string;
  condition?: Condition;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
  saleType?: SaleType;
}

//
// DTOs for User operations
//

export interface CreateUserInput {
  email: string;
  username: string;
  name?: string;
  university?: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  avatar?: string;
  university?: string;
}

//
// Response types
//

export interface ItemWithRelations {
  id: string;
  title: string;
  description: string | null;
  price: number;
  condition: Condition;
  status: ItemStatus;
  saleType: SaleType;
  images: string[];
  pickupLocation: string | null;
  isUrgent: boolean;
  isSold: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  sellerId: string;
  seller: {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
  };
  auction?: {
    id: string;
    startingPrice: number;
    currentBid: number | null;
    endTime: Date;
    _count: {
      bids: number;
    };
  } | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
