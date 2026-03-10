import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ConversationService } from '@/services/conversation.service';
import { formatRelativeTime } from '@/lib/utils';

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  const conversations = await ConversationService.getUserConversations(userId);

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

      {/* Conversations List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

        {conversations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start a conversation by contacting a seller
            </p>
            <Link
              href="/items"
              className="inline-flex items-center px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon-dark transition"
            >
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Item Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {conversation.item.images.length > 0 ? (
                      <img
                        src={conversation.item.images[0]}
                        alt={conversation.item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-8 h-8"
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

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-0.5">
                          {conversation.item.title}
                        </p>
                        <h3 className="font-semibold text-gray-900">
                          {conversation.otherParticipant.name ||
                            conversation.otherParticipant.username}
                        </h3>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {conversation.lastMessage
                          ? formatRelativeTime(conversation.lastMessage.createdAt)
                          : formatRelativeTime(conversation.updatedAt)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {conversation.lastMessage ? (
                        <>
                          <span className="font-medium">
                            {conversation.lastMessage.senderId === userId
                              ? 'You: '
                              : ''}
                          </span>
                          {conversation.lastMessage.content}
                        </>
                      ) : (
                        <span className="text-gray-400 italic">
                          Start the conversation...
                        </span>
                      )}
                    </p>

                    {conversation.unreadCount > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-maroon/10 text-maroon-dark">
                          {conversation.unreadCount} new
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
