'use client';

import { formatRelativeTime } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

interface Bid {
  id: string;
  amount: number;
  createdAt: Date;
  bidder: {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
  };
}

interface BidHistoryProps {
  bids: Bid[];
}

export function BidHistory({ bids }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No bids yet. Be the first to bid!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {bids.map((bid, index) => (
        <div
          key={bid.id}
          className={`flex items-center justify-between p-3 rounded-lg ${
            index === 0
              ? 'bg-maroon/10 border border-maroon/20'
              : 'bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-maroon text-white flex items-center justify-center text-sm font-medium">
              {bid.bidder.name?.charAt(0).toUpperCase() ||
                bid.bidder.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {bid.bidder.name || bid.bidder.username}
              </p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(bid.createdAt)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {formatPrice(bid.amount)}
            </p>
            {index === 0 && (
              <span className="text-xs text-maroon font-medium">
                Highest Bid
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
