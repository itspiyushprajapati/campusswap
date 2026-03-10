'use client';

import { formatRelativeTime } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
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

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
      <div className="flex items-start gap-4">
        {/* Reviewer Avatar */}
        <div className="w-10 h-10 rounded-full bg-maroon/10 text-maroon flex items-center justify-center font-bold text-sm flex-shrink-0">
          {review.reviewer.name?.charAt(0).toUpperCase() ||
            review.reviewer.username.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">
              {review.reviewer.name || review.reviewer.username}
            </span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
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
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {formatRelativeTime(review.createdAt)}
            </span>
          </div>

          {/* Reviewed Item */}
          <p className="text-sm text-gray-500 mb-2">
            Reviewed: {review.item.title}
          </p>

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-700">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
