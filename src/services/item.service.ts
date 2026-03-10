import { db } from '@/lib/db';
import { AuctionService } from './auction.service';
import type {
  CreateItemInput,
  UpdateItemInput,
  ItemFilters,
  ItemWithRelations,
  PaginatedResponse,
} from '@/models/types';
import type { Prisma } from '@prisma/client';

const DEFAULT_PAGE_SIZE = 20;

/**
 * Service for handling Item business logic
 */
export const ItemService = {
  /**
   * Get all items with optional filtering and pagination
   */
  async getItems(
    filters: ItemFilters = {},
    page: number = 1,
    limit: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedResponse<ItemWithRelations>> {
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: Prisma.ItemWhereInput = {
      status: 'AVAILABLE',
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.condition) {
      where.condition = filters.condition;
    }

    if (filters.saleType) {
      where.saleType = filters.saleType;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.searchQuery) {
      where.OR = [
        { title: { contains: filters.searchQuery, mode: 'insensitive' } },
        { description: { contains: filters.searchQuery, mode: 'insensitive' } },
      ];
    }

    // Build orderBy based on sort
    let orderBy: Prisma.ItemOrderByWithRelationInput = { createdAt: 'desc' };
    switch (filters.sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [items, total] = await Promise.all([
      db.item.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          seller: {
            select: { id: true, username: true, name: true, avatar: true },
          },
          auction: {
            select: {
              id: true,
              startingPrice: true,
              currentBid: true,
              endTime: true,
              _count: {
                select: { bids: true },
              },
            },
          },
        },
      }),
      db.item.count({ where }),
    ]);

    return {
      data: items as ItemWithRelations[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get a single item by ID
   */
  async getItemById(id: string): Promise<ItemWithRelations | null> {
    const item = await db.item.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        seller: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        auction: {
          select: {
            id: true,
            startingPrice: true,
            currentBid: true,
            endTime: true,
            _count: {
              select: { bids: true },
            },
          },
        },
      },
    });

    return item as ItemWithRelations | null;
  },

  /**
   * Get items by seller
   */
  async getItemsBySeller(
    sellerId: string,
    page: number = 1,
    limit: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedResponse<ItemWithRelations>> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      db.item.findMany({
        where: { sellerId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          seller: {
            select: { id: true, username: true, name: true, avatar: true },
          },
          auction: {
            select: {
              id: true,
              startingPrice: true,
              currentBid: true,
              endTime: true,
              _count: {
                select: { bids: true },
              },
            },
          },
        },
      }),
      db.item.count({ where: { sellerId } }),
    ]);

    return {
      data: items as ItemWithRelations[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Create a new item listing
   */
  async createItem(
    sellerId: string,
    input: CreateItemInput
  ): Promise<ItemWithRelations> {
    const { saleType, pickupLocation, isUrgent, ...itemData } = input;

    // Create the item with optional auction
    const item = await db.item.create({
      data: {
        ...itemData,
        sellerId,
        saleType: saleType || 'FIXED',
        pickupLocation,
        isUrgent: isUrgent || false,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        seller: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        auction: {
          select: {
            id: true,
            startingPrice: true,
            currentBid: true,
            endTime: true,
            _count: {
              select: { bids: true },
            },
          },
        },
      },
    });

    // If it's an auction, create the auction record
    if (saleType === 'AUCTION' && input.price) {
      // Calculate end time (7 days from now by default)
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + 7);

      await AuctionService.createAuction(
        item.id,
        input.price, // Starting price
        endTime
      );
    }

    return item as ItemWithRelations;
  },

  /**
   * Update an item
   */
  async updateItem(
    id: string,
    sellerId: string,
    input: UpdateItemInput
  ): Promise<ItemWithRelations | null> {
    // Verify ownership
    const existing = await db.item.findFirst({
      where: { id, sellerId },
    });

    if (!existing) return null;

    const item = await db.item.update({
      where: { id },
      data: input,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        seller: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        auction: {
          select: {
            id: true,
            startingPrice: true,
            currentBid: true,
            endTime: true,
            _count: {
              select: { bids: true },
            },
          },
        },
      },
    });

    return item as ItemWithRelations;
  },

  /**
   * Delete an item
   */
  async deleteItem(id: string, sellerId: string): Promise<boolean> {
    // Verify ownership
    const existing = await db.item.findFirst({
      where: { id, sellerId },
    });

    if (!existing) return false;

    await db.item.delete({ where: { id } });
    return true;
  },

  /**
   * Mark item as sold
   */
  async markAsSold(id: string, sellerId: string): Promise<ItemWithRelations | null> {
    // Verify ownership
    const existing = await db.item.findFirst({
      where: { id, sellerId },
    });

    if (!existing) return null;

    const item = await db.item.update({
      where: { id },
      data: {
        isSold: true,
        status: 'SOLD',
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        seller: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        auction: {
          select: {
            id: true,
            startingPrice: true,
            currentBid: true,
            endTime: true,
            _count: {
              select: { bids: true },
            },
          },
        },
      },
    });

    return item as ItemWithRelations;
  },

  /**
   * Search items
   */
  async searchItems(
    query: string,
    page: number = 1,
    limit: number = DEFAULT_PAGE_SIZE
  ): Promise<PaginatedResponse<ItemWithRelations>> {
    return this.getItems({ searchQuery: query }, page, limit);
  },
};
