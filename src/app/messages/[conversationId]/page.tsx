import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ConversationService } from '@/services/conversation.service';
import { MessageService } from '@/services/message.service';
import { MessageThread } from '@/components/messages/MessageThread';
import { formatPrice } from '@/lib/utils';

interface ConversationPageProps {
  params: {
    conversationId: string;
  };
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Get conversation with security check
  const conversation = await ConversationService.getById(params.conversationId);

  if (!conversation) {
    notFound();
  }

  // Security: Only buyer or seller can access
  const isParticipant =
    conversation.buyerId === userId || conversation.sellerId === userId;

  if (!isParticipant) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-2xl font-bold text-maroon">
              GBU Swap
            </Link>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to view this conversation.
          </p>
          <Link href="/messages" className="text-maroon hover:underline">
            Go back to messages
          </Link>
        </div>
      </main>
    );
  }

  const isBuyer = conversation.buyerId === userId;
  const otherParticipant = isBuyer ? conversation.seller : conversation.buyer;

  // Mark messages as read
  await MessageService.markAsRead(params.conversationId, userId);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-maroon shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              GBU Swap
            </Link>
          </div>
        </div>
      </header>

      {/* Conversation Container */}
      <div className="max-w-3xl mx-auto">
        {/* Item Header */}
        <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/items/${conversation.item.id}`}
            className="flex items-center gap-4 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition"
          >
            {/* Item Image */}
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {conversation.item.images.length > 0 ? (
                <img
                  src={conversation.item.images[0]}
                  alt={conversation.item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500">About this item</p>
              <h2 className="font-semibold text-gray-900 line-clamp-1">
                {conversation.item.title}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(conversation.item.price)}
              </span>
            </div>
          </Link>
        </div>

        {/* Chat Header */}
        <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <Link href="/messages" className="text-gray-500 hover:text-gray-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-maroon/10 text-maroon flex items-center justify-center font-medium">
                {otherParticipant.avatar ? (
                  <img
                    src={otherParticipant.avatar}
                    alt={otherParticipant.name || otherParticipant.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (otherParticipant.name?.charAt(0) ||
                    otherParticipant.username.charAt(0).toUpperCase())
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {otherParticipant.name || otherParticipant.username}
                </p>
                <p className="text-xs text-gray-500">
                  {isBuyer ? 'Seller' : 'Buyer'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <MessageThread
          conversationId={conversation.id}
          initialMessages={conversation.messages}
          currentUserId={userId}
          isBuyer={isBuyer}
        />
      </div>
    </main>
  );
}
