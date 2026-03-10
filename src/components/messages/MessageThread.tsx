'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { sendMessage } from '@/app/actions/messages';
import type { MessageWithSender } from '@/services/message.service';

interface MessageThreadProps {
  conversationId: string;
  initialMessages: MessageWithSender[];
  currentUserId: string;
  isBuyer: boolean;
}

export function MessageThread({
  conversationId,
  initialMessages,
  currentUserId,
  isBuyer,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<MessageWithSender[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isSending) return;

    setIsSending(true);
    setError(null);

    // Optimistically add message to UI
    const optimisticMessage: MessageWithSender = {
      id: 'temp-' + Date.now(),
      content: trimmedMessage,
      createdAt: new Date(),
      isRead: false,
      senderId: currentUserId,
      sender: {
        id: currentUserId,
        name: null,
        username: '',
        avatar: null,
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      const result = await sendMessage(conversationId, trimmedMessage);

      if (result && 'error' in result) {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
        setError(result.error ?? 'An error occurred');
        setNewMessage(trimmedMessage); // Restore message
      } else if (result && 'message' in result) {
        // Replace optimistic message with actual message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticMessage.id ? (result.message as MessageWithSender) : m
          )
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setError('Failed to send message. Please try again.');
      setNewMessage(trimmedMessage);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const formatMessageTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date));
  };

  const formatMessageDate = (date: Date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(messageDate);
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: MessageWithSender[] }[] = [];
  let currentGroup: { date: string; messages: MessageWithSender[] } | null = null;

  messages.forEach((message) => {
    const messageDate = formatMessageDate(message.createdAt);

    if (!currentGroup || currentGroup.date !== messageDate) {
      currentGroup = { date: messageDate, messages: [] };
      groupedMessages.push(currentGroup);
    }

    currentGroup.messages.push(message);
  });

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[400px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
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
            <p className="text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date} className="space-y-4">
              {/* Date separator */}
              <div className="flex items-center justify-center">
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {group.date}
                </span>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4">
                {group.messages.map((message) => {
                  const isCurrentUser = message.senderId === currentUserId;
                  const isOtherUserSeller = !isBuyer === isCurrentUser;
                  const showOnRight = isCurrentUser;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${
                        showOnRight ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          showOnRight ? 'items-end' : 'items-start'
                        }`}
                      >
                        {/* Sender name (only for other user) */}
                        {!isCurrentUser && (
                          <p className="text-xs text-gray-500 mb-1 ml-1">
                            {message.sender.name || message.sender.username}
                          </p>
                        )}

                        {/* Message bubble */}
                        <div
                          className={`px-4 py-2.5 rounded-2xl ${
                            showOnRight
                              ? 'bg-maroon text-white rounded-br-md'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>

                        {/* Time */}
                        <p
                          className={`text-xs text-gray-400 mt-1 ${
                            showOnRight ? 'text-right mr-1' : 'text-left ml-1'
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                          {isCurrentUser && (
                            <span className="ml-1">
                              {message.isRead ? '• Read' : '• Sent'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-maroon focus:border-transparent disabled:bg-gray-100"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            isLoading={isSending}
            className="px-6"
          >
            <span className="hidden sm:inline">Send</span>
            <svg
              className="w-5 h-5 sm:ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </form>
      </div>
    </div>
  );
}
