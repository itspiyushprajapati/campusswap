import { db } from '@/lib/db';
import { AuctionService } from './auction.service';
import type { Bid } from '@prisma/client';

export interface BidWithBidder extends Bid {
  bidder: {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
  };
}

/**
 * Service for handling Bid business logic
 */
export const BidService = {
  /**
   * Place a new bid on an auction
   */
  async placeBid(
    auctionId: string,
    bidderId: string,
    amount: number
  ): Promise<{ success: boolean; bid?: Bid; error?: string }> {
    // Get auction with current highest bid
    const auction = await db.auction.findUnique({
      where: { id: auctionId },
      include: {
        item: true,
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
        },
      },
    });

    if (!auction) {
      return { success: false, error: 'Auction not found' };
    }

    // Check if auction has ended
    if (AuctionService.hasAuctionEnded(auction.endTime)) {
      return { success: false, error: 'Auction has ended' };
    }

    // Check if seller is trying to bid
    if (auction.item.sellerId === bidderId) {
      return { success: false, error: 'Sellers cannot bid on their own items' };
    }

    // Determine minimum bid amount
    const highestBid = auction.bids[0]?.amount || 0;
    const minBidAmount = highestBid > 0 ? highestBid + 10 : auction.startingPrice;

    // Validate bid amount
    if (amount <= highestBid) {
      return {
        success: false,
        error: `Bid must be higher than current bid of ₹${highestBid}`,
      };
    }

    if (amount < minBidAmount) {
      return {
        success: false,
        error: `Minimum bid amount is ₹${minBidAmount}`,
      };
    }

    // Create bid and update auction in a transaction
    const bid = await db.$transaction(async (tx) => {
      // Create the bid
      const newBid = await tx.bid.create({
        data: {
          auctionId,
          bidderId,
          amount,
        },
      });

      // Update auction's current bid
      await tx.auction.update({
        where: { id: auctionId },
        data: {
          currentBid: amount,
        },
      });

      return newBid;
    });

    return { success: true, bid };
  },

  /**
   * Get all bids for an auction
   */
  async getBidsByAuction(auctionId: string): Promise<BidWithBidder[]> {
    const bids = await db.bid.findMany({
      where: { auctionId },
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
    });

    return bids as BidWithBidder[];
  },

  /**
   * Get bids by user
   */
  async getBidsByUser(userId: string): Promise<BidWithBidder[]> {
    const bids = await db.bid.findMany({
      where: { bidderId: userId },
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
        auction: {
          select: {
            id: true,
            currentBid: true,
            endTime: true,
            item: {
              select: {
                id: true,
                title: true,
                isSold: true,
              },
            },
          },
        },
      },
    });

    return bids as BidWithBidder[];
  },

  /**
   * Get the highest bid for an auction
   */
  async getHighestBid(auctionId: string): Promise<BidWithBidder | null> {
    const bid = await db.bid.findFirst({
      where: { auctionId },
      orderBy: { amount: 'desc' },
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
    });

    return bid as BidWithBidder | null;
  },

  /**
   * Check if user has bid on auction
   */
  async hasUserBid(auctionId: string, userId: string): Promise<boolean> {
    const count = await db.bid.count({
      where: {
        auctionId,
        bidderId: userId,
      },
    });

    return count > 0;
  },

  /**
   * Get user's last bid amount on an auction
   */
  async getUserLastBid(auctionId: string, userId: string): Promise<number | null> {
    const bid = await db.bid.findFirst({
      where: {
        auctionId,
        bidderId: userId,
      },
      orderBy: { createdAt: 'desc' },
    });

    return bid?.amount ?? null;
  },
};
