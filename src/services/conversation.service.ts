import { db } from '@/lib/db';
import type { Conversation, Message } from '@prisma/client';

export interface ConversationWithDetails extends Conversation {
  item: {
    id: string;
    title: string;
    images: string[];
    price: number;
  };
  buyer: {
    id: string;
    name: string | null;
    username: string;
    avatar: string | null;
  };
  seller: {
    id: string;
    name: string | null;
    username: string;
    avatar: string | null;
  };
  messages: {
    id: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
    senderId: string;
    conversationId: string;
    sender: {
      id: string;
      name: string | null;
      username: string;
      avatar: string | null;
    };
  }[];
  _count?: {
    messages: number;
  };
}

export interface ConversationListItem {
  id: string;
  item: {
    id: string;
    title: string;
    images: string[];
  };
  otherParticipant: {
    id: string;
    name: string | null;
    username: string;
    avatar: string | null;
  };
  lastMessage: {
    id: string;
    createdAt: Date;
    content: string;
    isRead: boolean;
    senderId: string;
    conversationId: string;
  } | null;
  unreadCount: number;
  updatedAt: Date;
}

export const ConversationService = {
  /**
   * Find or create a conversation between buyer and seller for an item
   */
  async findOrCreate(
    itemId: string,
    buyerId: string,
    sellerId: string
  ): Promise<Conversation> {
    // Check if conversation already exists
    const existing = await db.conversation.findUnique({
      where: {
        itemId_buyerId_sellerId: {
          itemId,
          buyerId,
          sellerId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        itemId,
        buyerId,
        sellerId,
      },
    });

    return conversation;
  },

  /**
   * Get a conversation by ID with all details
   */
  async getById(id: string): Promise<ConversationWithDetails | null> {
    const conversation = await db.conversation.findUnique({
      where: { id },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return conversation as ConversationWithDetails | null;
  },

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId: string): Promise<ConversationListItem[]> {
    const conversations = await db.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            isRead: true,
            conversationId: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conv) => {
      const isBuyer = conv.buyerId === userId;
      const otherParticipant = isBuyer ? conv.seller : conv.buyer;
      const lastMessage = conv.messages[0] || null;

      // Count unread messages
      const unreadCount = 0; // Will be calculated based on last read

      return {
        id: conv.id,
        item: conv.item,
        otherParticipant,
        lastMessage,
        unreadCount,
        updatedAt: conv.updatedAt,
      };
    });
  },

  /**
   * Check if user is a participant in a conversation
   */
  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      select: { buyerId: true, sellerId: true },
    });

    if (!conversation) return false;

    return conversation.buyerId === userId || conversation.sellerId === userId;
  },

  /**
   * Update conversation timestamp (to move it to top)
   */
  async updateTimestamp(id: string): Promise<void> {
    await db.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
  },
};
