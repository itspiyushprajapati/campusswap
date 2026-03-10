'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import type { AuctionWithBids } from '@/services/auction.service';

interface AuctionBidFormProps {
  auction: AuctionWithBids;
  currentUserId?: string;
  placeBidAction: (formData: FormData) => Promise<void>;
}

export function AuctionBidForm({
  auction,
  currentUserId,
  placeBidAction,
}: AuctionBidFormProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const highestBid = auction.bids.length > 0 ? auction.bids[0].amount : null;
  const minBid = highestBid
    ? highestBid + 10
    : auction.startingPrice;

  const userHasBid = currentUserId
    ? auction.bids.some((bid) => bid.bidderId === currentUserId)
    : false;

  const isHighestBidder = currentUserId && highestBid
    ? auction.bids[0]?.bidderId === currentUserId
    : false;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('bidAmount', bidAmount);

    await placeBidAction(formData);
  }

  // Quick bid options
  const quickBids = [
    minBid,
    minBid + 50,
    minBid + 100,
    minBid + 250,
  ];

  if (!currentUserId) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-gray-700 font-medium">Sign in to place a bid</p>
        <p className="text-sm text-gray-500 mt-1">
          You must be logged in to participate in this auction
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center mt-3 px-4 py-2 border-2 border-maroon text-maroon hover:bg-maroon/10 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-maroon focus:ring-offset-2"
        >
          Sign In
        </a>
      </div>
    );
  }

  if (auction.item.sellerId === currentUserId) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-gray-700 font-medium">You are the seller</p>
        <p className="text-sm text-gray-500 mt-1">
          You cannot bid on your own items
        </p>
      </div>
    );
  }

  return (
    <div className="bg-maroon/10 border border-maroon/20 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Place Your Bid</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-3">
          {error}
        </div>
      )}

      {isHighestBidder && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm mb-3">
          You are currently the highest bidder!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            htmlFor="bidAmount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your bid (min: {formatPrice(minBid)})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              ₹
            </span>
            <input
              type="number"
              id="bidAmount"
              name="bidAmount"
              min={minBid}
              step="1"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent text-lg"
              placeholder={minBid.toString()}
            />
          </div>
        </div>

        {/* Quick bid buttons */}
        <div className="flex flex-wrap gap-2">
          {quickBids.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setBidAmount(amount.toString())}
              className="text-sm px-3 py-1 bg-white border border-gray-300 rounded-full hover:border-maroon hover:text-maroon transition"
            >
              +{formatPrice(amount - (highestBid || auction.startingPrice)).replace('₹', '')}
            </button>
          ))}
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
          size="lg"
        >
          {userHasBid ? 'Increase Bid' : 'Place Bid'}
        </Button>

        {userHasBid && (
          <p className="text-xs text-gray-500 text-center">
            You have already placed a bid on this auction.
          </p>
        )}
      </form>
    </div>
  );
}
