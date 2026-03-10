import { db } from '@/lib/db';
import { ConversationService } from './conversation.service';

export interface MessageWithSender {
  id: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  senderId: string;
  sender: {
    id: string;
    name: string | null;
    username: string;
    avatar: string | null;
  };
}

export const MessageService = {
  /**
   * Send a new message in a conversation
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<MessageWithSender> {
    // Create the message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId,
        content: content.trim(),
      },
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
    });

    // Update conversation timestamp to move it to top
    await ConversationService.updateTimestamp(conversationId);

    return message as MessageWithSender;
  },

  /**
   * Get all messages in a conversation
   */
  async getMessagesByConversation(
    conversationId: string
  ): Promise<MessageWithSender[]> {
    const messages = await db.message.findMany({
      where: { conversationId },
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
    });

    return messages as MessageWithSender[];
  },

  /**
   * Mark messages as read in a conversation for a specific user
   */
  async markAsRead(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  },

  /**
   * Get unread message count for a user across all conversations
   */
  async getUnreadCount(userId: string): Promise<number> {
    const count = await db.message.count({
      where: {
        conversation: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
        senderId: { not: userId },
        isRead: false,
      },
    });

    return count;
  },
};
