'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { ConditionBadge } from './ConditionBadge';
import { formatPrice, formatRelativeTime } from '@/lib/utils';
import type { ItemWithRelations } from '@/models/types';

interface ItemCardProps {
  item: ItemWithRelations;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`} className="group">
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Badges container */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <ConditionBadge condition={item.condition} size="sm" />
          </div>

          {/* Urgent badge */}
          {item.isUrgent && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                URGENT
              </span>
            </div>
          )}

          {/* Sold overlay */}
          {item.isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-2xl font-bold border-4 border-white px-4 py-2 transform -rotate-12">
                SOLD
              </span>
            </div>
          )}

          {/* Auction badge */}
          {item.saleType === 'AUCTION' && !item.isSold && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-maroon text-white text-xs font-bold px-2 py-1 rounded-full">
                AUCTION
              </span>
            </div>
          )}

          {/* Image count badge */}
          {item.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
              </svg>
              {item.images.length}
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <p className="text-xs text-gray-500 mb-1">{item.category.name}</p>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-maroon transition-colors">
            {item.title}
          </h3>

          {/* Pickup Location */}
          {item.pickupLocation && (
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {item.pickupLocation}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {item.saleType === 'AUCTION' && item.auction?.currentBid
                ? formatPrice(item.auction.currentBid)
                : formatPrice(item.price)}
            </span>
            <span className="text-xs text-gray-400">
              {formatRelativeTime(item.createdAt)}
            </span>
          </div>

          {/* Show bid count for auctions */}
          {item.saleType === 'AUCTION' && item.auction && (
            <p className="text-xs text-gray-500 mt-1">
              {item.auction._count.bids > 0
                ? `${item.auction._count.bids} bid${item.auction._count.bids !== 1 ? 's' : ''}`
                : 'No bids yet'}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
