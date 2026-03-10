'use server';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ConversationService } from '@/services/conversation.service';

export async function startConversation(itemId: string, sellerId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { error: 'You must be logged in to contact the seller', redirectTo: '/login' };
    }

    const buyerId = session.user.id;

    // Cannot contact yourself
    if (buyerId === sellerId) {
      return { error: 'You cannot contact yourself about your own item' };
    }

    // Find or create conversation
    const conversation = await ConversationService.findOrCreate(
      itemId,
      buyerId,
      sellerId
    );

    // Redirect to the conversation
    redirect(`/messages/${conversation.id}`);
  } catch (error) {
    console.error('Error starting conversation:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to start conversation',
    };
  }
}
