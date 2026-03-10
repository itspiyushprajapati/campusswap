import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { ItemService } from '@/services/item.service';
import { AuctionService } from '@/services/auction.service';
import { BidService } from '@/services/bid.service';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import { ConditionBadge } from '@/components/items/ConditionBadge';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { ImageGallery } from '@/components/items/ImageGallery';
import { authOptions } from '@/lib/auth';
import { contactSeller } from '@/app/actions/messaging';
import { AuctionBidForm } from '@/components/items/AuctionBidForm';
import { BidHistory } from '@/components/items/BidHistory';
import { ReviewService } from '@/services/review.service';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import type { AuctionWithBids } from '@/services/auction.service';

interface ItemDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ItemDetailPage({
  params,
}: ItemDetailPageProps) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const item = await ItemService.getItemById(params.id);

  if (!item) {
    notFound();
  }

  const isSeller = userId === item.sellerId;

  // Get auction details if this is an auction item
  let auction: AuctionWithBids | null = null;
  if (item.saleType === 'AUCTION') {
    auction = await AuctionService.getAuctionByItemId(item.id);
  }

  // Get seller stats
  const sellerStats = await ReviewService.getSellerStats(item.sellerId);

  // Check if user can review (only if they bought this item)
  let canReview = false;
  if (userId && !isSeller) {
    const reviewCheck = await ReviewService.canReview(userId, item.sellerId, item.id);
    canReview = reviewCheck.canReview;
  }

  // Get existing reviews for this seller
  const sellerReviews = await ReviewService.getReviewsBySeller(item.sellerId);
  const hasReviewed = userId ? sellerReviews.some(r => r.reviewerId === userId && r.itemId === item.id) : false;

  // Handle potentially null item in server actions
  const itemId = item.id;
  const itemSellerId = item.sellerId;

  // Check if auction has ended
  const auctionEnded = auction ? AuctionService.hasAuctionEnded(auction.endTime) : false;
  const highestBid = auction ? AuctionService.getHighestBid(auction) : null;
  const remainingTime = auction ? AuctionService.getRemainingTime(auction.endTime) : null;

  async function handleContactSeller() {
    'use server';

    if (!userId) {
      redirect('/login');
    }

    await contactSeller(itemId, itemSellerId);
  }

  async function handleMarkAsSold(): Promise<void> {
    'use server';

    if (!userId || !isSeller) {
      redirect('/');
      return;
    }

    await ItemService.markAsSold(itemId, userId);
    redirect(`/items/${itemId}`);
  }

  async function handleSubmitReview(rating: number, comment: string): Promise<{ success: boolean; error?: string }> {
    'use server';

    if (!userId) {
      return { success: false, error: 'You must be logged in' };
    }

    const result = await ReviewService.createReview(userId, itemSellerId, itemId, rating, comment);
    return result;
  }

  async function handlePlaceBid(formData: FormData): Promise<void> {
    'use server';

    if (!userId) {
      redirect('/login');
      return;
    }

    const bidAmount = parseFloat(formData.get('bidAmount') as string);

    const currentAuction = auction;
    if (!currentAuction || currentAuction.item.sellerId === userId) {
      redirect(`/items/${itemId}`);
      return;
    }

    if (auctionEnded) {
      redirect(`/items/${itemId}`);
      return;
    }

    if (isNaN(bidAmount) || bidAmount <= 0) {
      redirect(`/items/${itemId}`);
      return;
    }

    const result = await BidService.placeBid(currentAuction.id, userId, bidAmount);

    if (!result.success) {
      redirect(`/items/${itemId}`);
      return;
    }

    redirect(`/items/${itemId}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <header className="bg-maroon shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-white">
            GBU Swap
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <ImageGallery images={item.images} title={item.title} />

            {/* Details Section */}
            <div className="p-6 md:p-8">
              {/* Status badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-gray-500">{item.category.name}</span>
                {item.isUrgent && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    URGENT SALE
                  </span>
                )}
                {item.saleType === 'AUCTION' && (
                  <span className="bg-maroon text-white text-xs font-bold px-2 py-1 rounded-full">
                    AUCTION
                  </span>
                )}
                {item.isSold && (
                  <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    SOLD
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mt-1">{item.title}</h1>
              <p className="text-xs text-gray-400 mt-1">
                Listed {formatRelativeTime(item.createdAt)}
              </p>

              {/* Pickup Location */}
              {item.pickupLocation && (
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Pickup: {item.pickupLocation}</span>
                </div>
              )}

              {/* Price display - different for auction vs fixed */}
              <div className="mt-6">
                {item.saleType === 'AUCTION' && auction ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {auction.currentBid
                          ? formatPrice(auction.currentBid)
                          : formatPrice(auction.startingPrice)}
                      </span>
                      <span className="text-gray-500">
                        {auction.currentBid ? 'Current Bid' : 'Starting Price'}
                      </span>
                    </div>

                    {/* Auction timer */}
                    {!auctionEnded && remainingTime && (
                      <div className="bg-maroon/10 border border-maroon/20 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          Ends in: {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m
                        </p>
                      </div>
                    )}

                    {auctionEnded && (
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700 font-medium">
                          Auction Ended
                        </p>
                        {highestBid && (
                          <p className="text-sm text-gray-600">
                            Final bid: {formatPrice(highestBid.amount)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Bid count */}
                    <p className="text-sm text-gray-500">
                      {auction._count.bids} bid{auction._count.bids !== 1 ? 's' : ''} placed
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                    <ConditionBadge condition={item.condition} />
                  </div>
                )}
              </div>

              {item.description && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{item.description}</p>
                </div>
              )}

              {/* Seller Info with Rating */}
              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Seller</h3>
                <Link
                  href={`/profile/${item.sellerId}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-maroon text-white flex items-center justify-center font-bold">
                    {item.seller.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-maroon transition-colors">
                      {item.seller.name || item.seller.username}
                    </p>
                    <p className="text-sm text-gray-500">@{item.seller.username}</p>
                    {/* Rating Display */}
                    {sellerStats.totalReviews > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(sellerStats.averageRating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {sellerStats.averageRating.toFixed(1)} ({sellerStats.totalReviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                {/* Auction Bid Form */}
                {item.saleType === 'AUCTION' && auction && !auctionEnded && !isSeller && !item.isSold && (
                  <AuctionBidForm
                    auction={auction}
                    currentUserId={userId}
                    placeBidAction={handlePlaceBid}
                  />
                )}

                {/* Contact Seller Button - only for fixed price items */}
                {!isSeller && item.saleType === 'FIXED' && !item.isSold && (
                  <form action={handleContactSeller}>
                    <Button type="submit" className="w-full" size="lg">
                      Contact Seller
                    </Button>
                  </form>
                )}

                {/* Mark as Sold - only for seller */}
                {isSeller && !item.isSold && item.saleType === 'FIXED' && (
                  <form action={handleMarkAsSold}>
                    <Button type="submit" variant="outline" className="w-full" size="lg">
                      Mark as Sold
                    </Button>
                  </form>
                )}

                {/* Sold message */}
                {item.isSold && (
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-lg font-semibold text-gray-700">
                      This item has been sold
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Check back for similar items
                    </p>
                  </div>
                )}

                {/* Review Form - only show if user can review and hasn't reviewed yet */}
                {canReview && !hasReviewed && (
                  <div className="mt-4 pt-4 border-t">
                    <ReviewForm
                      sellerId={item.sellerId}
                      itemId={item.id}
                      itemTitle={item.title}
                      onSubmit={handleSubmitReview}
                    />
                  </div>
                )}

                {/* Show message if user has already reviewed */}
                {hasReviewed && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 text-center">
                      You have already reviewed this seller for this item.
                    </p>
                  </div>
                )}
              </div>

              {/* Bid History */}
              {item.saleType === 'AUCTION' && auction && auction.bids.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Bid History</h3>
                  <BidHistory bids={auction.bids} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Generate static params for all items (ISR)
export async function generateStaticParams() {
  const items = await db.item.findMany({
    where: { status: 'AVAILABLE' },
    select: { id: true },
  });

  return items.map((item) => ({ id: item.id }));
}
