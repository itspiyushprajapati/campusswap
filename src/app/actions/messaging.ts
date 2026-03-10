'use server';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ConversationService } from '@/services/conversation.service';
import { MessageService } from '@/services/message.service';

/**
 * Start or find a conversation with a seller
 */
export async function contactSeller(itemId: string, sellerId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: 'Must be logged in', redirectTo: '/login' };
    }

    const buyerId = session.user.id;

    // Can't contact yourself
    if (buyerId === sellerId) {
      return { error: 'Cannot contact yourself about your own item' };
    }

    // Find or create conversation
    const conversation = await ConversationService.findOrCreate(
      itemId,
      buyerId,
      sellerId
    );

    // Redirect to conversation
    redirect(`/messages/${conversation.id}`);
  } catch (error) {
    console.error('Error starting conversation:', error);
    return { error: 'Failed to start conversation' };
  }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(conversationId: string, content: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: 'Must be logged in' };
    }

    // Verify user is participant
    const isParticipant = await ConversationService.isParticipant(
      conversationId,
      session.user.id
    );

    if (!isParticipant) {
      return { error: 'Not authorized' };
    }

    // Send message
    const message = await MessageService.sendMessage(
      conversationId,
      session.user.id,
      content.trim()
    );

    return { success: true, message };
  } catch (error) {
    console.error('Error sending message:', error);
    return { error: 'Failed to send message' };
  }
}
