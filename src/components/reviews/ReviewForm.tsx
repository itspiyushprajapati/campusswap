'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ReviewFormProps {
  sellerId: string;
  itemId: string;
  itemTitle: string;
  onSubmit: (rating: number, comment: string) => Promise<{ success: boolean; error?: string }>;
}

export function ReviewForm({ sellerId, itemId, itemTitle, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await onSubmit(rating, comment);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to submit review');
    }

    setIsSubmitting(false);
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-semibold text-green-900 mb-1">Review Submitted!</h3>
        <p className="text-green-700 text-sm">Thank you for your feedback.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-2">Leave a Review</h3>
      <p className="text-gray-500 text-sm mb-4">How was your experience with {itemTitle}?</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <svg
                className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {rating === 5 && 'Excellent!'}
          {rating === 4 && 'Very Good'}
          {rating === 3 && 'Good'}
          {rating === 2 && 'Fair'}
          {rating === 1 && 'Poor'}
        </p>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comment <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon focus:border-transparent"
          placeholder="Share your experience with this seller..."
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Submit Review
      </Button>
    </form>
  );
}
