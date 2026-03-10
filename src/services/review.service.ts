import { db } from '@/lib/db';
import type { Review } from '@prisma/client';

export interface ReviewWithRelations extends Review {
  reviewer: {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
  };
  item: {
    id: string;
    title: string;
    images: string[];
  };
}

export interface SellerStats {
  averageRating: number;
  totalReviews: number;
}

/**
 * Service for handling Review business logic
 */
export const ReviewService = {
  /**
   * Create a new review
   */
  async createReview(
    reviewerId: string,
    sellerId: string,
    itemId: string,
    rating: number,
    comment?: string
  ): Promise<{ success: boolean; review?: Review; error?: string }> {
    // Validation: Check rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    // Validation: Cannot review yourself
    if (reviewerId === sellerId) {
      return { success: false, error: 'You cannot review yourself' };
    }

    // Validation: Check if item transaction exists
    const transaction = await db.transaction.findFirst({
      where: {
        itemId,
        buyerId: reviewerId,
        sellerId,
      },
    });

    if (!transaction) {
      return {
        success: false,
        error: 'You can only review sellers after a transaction',
      };
    }

    // Validation: Check if review already exists
    const existingReview = await db.review.findUnique({
      where: {
        reviewerId_itemId: {
          reviewerId,
          itemId,
        },
      },
    });

    if (existingReview) {
      return {
        success: false,
        error: 'You have already reviewed this item',
      };
    }

    // Create the review
    const review = await db.review.create({
      data: {
        reviewerId,
        sellerId,
        itemId,
        rating,
        comment,
      },
    });

    return { success: true, review };
  },

  /**
   * Get reviews for a seller
   */
  async getReviewsBySeller(sellerId: string): Promise<ReviewWithRelations[]> {
    const reviews = await db.review.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        item: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
      },
    });

    return reviews as ReviewWithRelations[];
  },

  /**
   * Get reviews by reviewer
   */
  async getReviewsByReviewer(reviewerId: string): Promise<ReviewWithRelations[]> {
    const reviews = await db.review.findMany({
      where: { reviewerId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        item: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
      },
    });

    return reviews as ReviewWithRelations[];
  },

  /**
   * Calculate seller rating statistics
   */
  async getSellerStats(sellerId: string): Promise<SellerStats> {
    const reviews = await db.review.findMany({
      where: { sellerId },
      select: { rating: true },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
    };
  },

  /**
   * Check if user can review seller for an item
   */
  async canReview(
    reviewerId: string,
    sellerId: string,
    itemId: string
  ): Promise<{ canReview: boolean; reason?: string }> {
    if (reviewerId === sellerId) {
      return { canReview: false, reason: 'You cannot review yourself' };
    }

    const transaction = await db.transaction.findFirst({
      where: {
        itemId,
        buyerId: reviewerId,
        sellerId,
      },
    });

    if (!transaction) {
      return {
        canReview: false,
        reason: 'You can only review after a transaction',
      };
    }

    const existingReview = await db.review.findUnique({
      where: {
        reviewerId_itemId: {
          reviewerId,
          itemId,
        },
      },
    });

    if (existingReview) {
      return {
        canReview: false,
        reason: 'You have already reviewed this item',
      };
    }

    return { canReview: true };
  },
};
