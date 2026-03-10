import { db } from '@/lib/db';
import type { Auction, Bid, User } from '@prisma/client';

export interface AuctionWithBids extends Auction {
  bids: (Bid & {
    bidder: {
      id: string;
      username: string;
      name: string | null;
      avatar: string | null;
    };
  })[];
  item: {
    id: string;
    title: string;
    sellerId: string;
    isSold: boolean;
  };
  _count: {
    bids: number;
  };
}

/**
 * Service for handling Auction business logic
 */
export const AuctionService = {
  /**
   * Create a new auction for an item
   */
  async createAuction(
    itemId: string,
    startingPrice: number,
    endTime: Date
  ): Promise<Auction> {
    const auction = await db.auction.create({
      data: {
        itemId,
        startingPrice,
        endTime,
      },
    });

    return auction;
  },

  /**
   * Get auction by item ID
   */
  async getAuctionByItemId(itemId: string): Promise<AuctionWithBids | null> {
    const auction = await db.auction.findUnique({
      where: { itemId },
      include: {
        bids: {
          orderBy: { createdAt: 'desc' },
          include: {
            bidder: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        item: {
          select: {
            id: true,
            title: true,
            sellerId: true,
            isSold: true,
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
    });

    return auction as AuctionWithBids | null;
  },

  /**
   * Get auction by ID
   */
  async getAuctionById(id: string): Promise<AuctionWithBids | null> {
    const auction = await db.auction.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: { createdAt: 'desc' },
          include: {
            bidder: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        item: {
          select: {
            id: true,
            title: true,
            sellerId: true,
            isSold: true,
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
    });

    return auction as AuctionWithBids | null;
  },

  /**
   * Update the current bid on an auction
   */
  async updateCurrentBid(
    auctionId: string,
    amount: number
  ): Promise<Auction> {
    const auction = await db.auction.update({
      where: { id: auctionId },
      data: {
        currentBid: amount,
      },
    });

    return auction;
  },

  /**
   * Check if auction has ended
   */
  hasAuctionEnded(endTime: Date): boolean {
    return new Date() > new Date(endTime);
  },

  /**
   * Close auction and mark item as sold
   */
  async closeAuction(auctionId: string): Promise<void> {
    await db.$transaction(async (tx) => {
      const auction = await tx.auction.findUnique({
        where: { id: auctionId },
        include: { item: true },
      });

      if (auction && auction.item) {
        await tx.item.update({
          where: { id: auction.item.id },
          data: {
            isSold: true,
            status: 'SOLD',
          },
        });
      }
    });
  },

  /**
   * Get highest bid from auction
   */
  getHighestBid(auction: AuctionWithBids): { amount: number; bidder: User } | null {
    if (auction.bids.length === 0) return null;
    const highestBid = auction.bids[0];
    return {
      amount: highestBid.amount,
      bidder: highestBid.bidder as unknown as User,
    };
  },

  /**
   * Get remaining time in auction
   */
  getRemainingTime(endTime: Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  } {
    const now = new Date();
    const end = new Date(endTime);
    const totalMs = end.getTime() - now.getTime();

    if (totalMs <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }

    const seconds = Math.floor((totalMs / 1000) % 60);
    const minutes = Math.floor((totalMs / 1000 / 60) % 60);
    const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, totalMs };
  },
};
