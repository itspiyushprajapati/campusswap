import { notFound } from 'next/navigation';
import Link from 'next/link';
import { UserService } from '@/services/user.service';
import { ItemService } from '@/services/item.service';
import { ReviewService } from '@/services/review.service';
import { ItemCard } from '@/components/items/ItemCard';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { formatPrice } from '@/lib/utils';

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await UserService.getUserById(params.userId);

  if (!user) {
    notFound();
  }

  // Get seller stats
  const sellerStats = await ReviewService.getSellerStats(params.userId);

  // Get user's items
  const itemsData = await ItemService.getItemsBySeller(params.userId);

  // Get reviews for this user
  const reviews = await ReviewService.getReviewsBySeller(params.userId);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-maroon shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-white">
            GBU Swap
          </Link>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-maroon text-white flex items-center justify-center text-4xl font-bold">
              {user.name?.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.name || user.username}
              </h1>
              <p className="text-gray-500">@{user.username}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
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
                  <span className="ml-2 font-semibold text-gray-900">
                    {sellerStats.averageRating > 0
                      ? sellerStats.averageRating.toFixed(1)
                      : 'No ratings yet'}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {sellerStats.totalReviews} review
                  {sellerStats.totalReviews !== 1 && 's'}
                </span>
              </div>

              {user.university && (
                <p className="text-gray-600 mt-1">
                  <svg
                    className="w-4 h-4 inline mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {user.university}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8">
          <button className="pb-4 border-b-2 border-maroon text-maroon font-medium">
            Items ({itemsData.pagination.total})
          </button>
          <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
            Reviews ({sellerStats.totalReviews})
          </button>
        </div>

        {/* Items Grid */}
        {itemsData.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itemsData.data.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items listed yet</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
