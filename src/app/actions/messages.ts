'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { MessageService } from '@/services/message.service';
import { ConversationService } from '@/services/conversation.service';

export async function sendMessage(conversationId: string, content: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: 'You must be logged in to send messages' };
    }

    const userId = session.user.id;

    // Security: Check if user is a participant in the conversation
    const isParticipant = await ConversationService.isParticipant(
      conversationId,
      userId
    );

    if (!isParticipant) {
      return { error: 'You are not authorized to send messages in this conversation' };
    }

    // Validate content
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { error: 'Message cannot be empty' };
    }

    if (trimmedContent.length > 2000) {
      return { error: 'Message is too long (max 2000 characters)' };
    }

    // Send the message
    const message = await MessageService.sendMessage(
      conversationId,
      userId,
      trimmedContent
    );

    return { message };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}
