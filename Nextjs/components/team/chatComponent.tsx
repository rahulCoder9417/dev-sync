import { Hash, Send, Users, Loader2, Trash, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Avatar from '../main/Avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';
import cuid from 'cuid';
import ShowTypers from "./ShowTypers";
import {
  sendChatMessage,
  addMessageToCache,
  setChatMessages,
  selectChatCache,
  Message,
  joinChat,
  leaveChat,
  sendMessage,
  updateMessageReadStatus,
  deleteMessageFromCache,
  updateIsFetched
} from '@/lib/redux/features/chatSlice';
import { showToast } from '../main/Toast';
import { DMAndTeamResult } from '@/lib/types/chat';

interface User {
  id: string;
  fullName: string;
  avatar: string;
  username: string;
  status: string;
}

interface SelectedChat {
  type: 'team' | 'direct';
  id: string;
  name: string;
}

interface ChatComponentProps {
  selectedChat: SelectedChat | null;
  dmAndTeam: DMAndTeamResult;
  useInProjectPage?: boolean;
}

const DEFAULT_CHAT_CACHE = {
  messages: [],
  pagination: null,
  currentPage: 1,
  isFetched: false
};

const MESSAGES_PER_PAGE = 30;

const ChatComponent: React.FC<ChatComponentProps> = ({ selectedChat, dmAndTeam,useInProjectPage=false }) => {
  const dispatch = useAppDispatch();
  const currentUserData = useAppSelector((state) => state.user, shallowEqual);
  
  // Refs
  const userTypingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);

  // Derived data
  const currentUser: User = {
    id: currentUserData.id,
    fullName: currentUserData.fullName,
    avatar: currentUserData.avatar,
    username: currentUserData.username,
    status: "online"
  };

  const isOnline = useAppSelector(
    (state) => {
      if (selectedChat?.type !== 'direct') return false;
      const friend = dmAndTeam.friends.find((u) => u.id === selectedChat.id);
      return friend ? state.onlineUser.onlineUsers.includes(friend.userId) : false;
    },
    shallowEqual
  );

  const currentChatCache = useAppSelector(
    (state) => selectedChat 
      ? selectChatCache(state, selectedChat.type, selectedChat.id) 
      : DEFAULT_CHAT_CACHE
  );

  const { messages, pagination, currentPage } = currentChatCache;

  // Helper to get receiver user ID for direct messages
  const getReceiverUserId = useCallback(() => {
    if (selectedChat?.type !== 'direct') return undefined;
    return dmAndTeam.friends.find((u) => u.id === selectedChat.id)?.userId;
  }, [selectedChat, dmAndTeam.friends]);

  // Fetch messages from API
  const fetchMessages = useCallback(async (page: number = 1) => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/chat/messages/get?chatType=${selectedChat.type}&chatId=${selectedChat.id}&page=${page}&limit=${MESSAGES_PER_PAGE}`
      );

      if (!response.ok) throw new Error('Failed to fetch messages');

      const data = await response.json();
      const updatedMessages = page === 1
        ? data.messages
        : [...data.messages, ...currentChatCache.messages];

      dispatch(setChatMessages({
        chatType: selectedChat.type,
        chatId: selectedChat.id,
        messages: updatedMessages,
        pagination: data.pagination,
      }));

      if (page === 1) {
        dispatch(sendChatMessage({
          action: "read",
          chatId: selectedChat.id,
          reciverId: getReceiverUserId(),
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChat, currentChatCache.messages, dispatch, getReceiverUserId]);

  // Mark unread messages as read
  const markUnreadMessagesAsRead = useCallback(async () => {
    if (!selectedChat || currentChatCache.isFetched) return;

    dispatch(updateIsFetched({
      chatType: selectedChat.type,
      chatId: selectedChat.id,
    }));

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].isRead !== false) break;
      
      await fetch(`/api/chat/messages/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: messages[i].id })
      });
    }
  }, [selectedChat, currentChatCache.isFetched, messages, dispatch]);

  // Handle message deletion
  const handleDelete = useCallback(async (msgId: string, forEveryone: boolean = false) => {
    if (!selectedChat) return;

    dispatch(deleteMessageFromCache({
      chatType: selectedChat.type,
      chatId: selectedChat.id,
      messageId: msgId,
    }));
    setShowChatOptions(null);

    try {
      const res = await fetch(`/api/chat/messages/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: msgId,
          forEveryone,
          chatId: selectedChat.id,
          chatType: selectedChat.type
        })
      });

      const data = await res.json();
      
      if (data.message === undefined) {
        showToast(false, "Failed to delete message", data.error);
        return;
      }

      if (data.message === "Message deleted" && forEveryone) {
        dispatch(sendChatMessage({
          action: "deleteMessage",
          chatType: selectedChat.type,
          chatId: selectedChat.id,
          messageId: msgId,
        }));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showToast(false, "Failed to delete message", "An error occurred");
    }
  }, [selectedChat, dispatch]);

  // Handle sending messages
  const handleSend = useCallback(() => {
    if (!messageText.trim() || !selectedChat) return;

    if (userTypingRef.current) {
      userTypingRef.current = false;
      dispatch(sendChatMessage({
        action: 'typingEnd',
        chatId: selectedChat.id,
      }));
    }

    const id = cuid();
    const timestamp = new Date().toString();
    const receiverUserId = getReceiverUserId();

    dispatch(sendMessage(
      selectedChat.type,
      selectedChat.id,
      id,
      messageText,
      timestamp,
      timestamp,
      receiverUserId!
    ));

    const newMessage: Message = {
      id,
      sender: currentUser,
      content: messageText,
      isRead: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    dispatch(addMessageToCache({
      chatType: selectedChat.type,
      chatId: selectedChat.id,
      message: newMessage,
    }));

    setMessageText('');
  }, [messageText, selectedChat, currentUser, dispatch, getReceiverUserId]);

  // Handle typing indicators
  const handleTypingStart = useCallback(() => {
    if (userTypingRef.current || !selectedChat) return;
    
    userTypingRef.current = true;
    dispatch(sendChatMessage({
      action: 'typingStart',
      chatId: selectedChat.id,
    }));
  }, [selectedChat, dispatch]);

  const handleTypingEnd = useCallback(() => {
    if (!userTypingRef.current || !selectedChat) return;
    
    userTypingRef.current = false;
    dispatch(sendChatMessage({
      action: "typingEnd",
      chatId: selectedChat.id,
    }));
  }, [selectedChat, dispatch]);

  // Load more messages
  const loadMoreMessages = useCallback(() => {
    if (pagination?.hasMore && !loading) {
      setFetchingMessages(true);
      fetchMessages(currentPage + 1);
    }
  }, [pagination, loading, currentPage, fetchMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (fetchingMessages) {
      setFetchingMessages(false);
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, fetchingMessages]);

  // Handle clicks outside chat options
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".chat-message")) {
        setShowChatOptions(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle chat selection and lifecycle
  useEffect(() => {
    if (!selectedChat) return;

    dispatch(joinChat(selectedChat.type, selectedChat.id));

    // Fetch messages if not cached
    if (currentChatCache.messages.length === 0 && !currentChatCache.isFetched) {
      fetchMessages(1);
    }

    // Mark messages as read if needed
    if (currentChatCache.messages.length > 0 && !currentChatCache.isFetched) {
      markUnreadMessagesAsRead();
    }

    // Send read receipt for direct messages
    if (selectedChat.type === "direct" && currentChatCache.messages.length > 0) {
      const lastMessage = currentChatCache.messages[currentChatCache.messages.length - 1];
      
      if (lastMessage.sender.id !== currentUserData.id) {
        dispatch(sendChatMessage({
          action: "read",
          chatId: selectedChat.id,
          reciverId: getReceiverUserId(),
        }));

        if (lastMessage.isRead === false) {
          dispatch(updateMessageReadStatus({
            chatId: selectedChat.id,
            userId: getReceiverUserId()!
          }));
        }
      }
    }

    // Cleanup on unmount
    const handleBeforeUnload = () => {
      dispatch(leaveChat(selectedChat.type, selectedChat.id));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      dispatch(leaveChat(selectedChat.type, selectedChat.id));
      dispatch(sendChatMessage({
        action: 'typingEnd',
        chatId: selectedChat.id,
      }));
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [selectedChat?.id, selectedChat?.type]);

  // Empty state
  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <div className="h-16 bg-card border-b border-primary px-6 flex items-center gap-4 flex-shrink-0" />
        <p className="text-primary mx-auto mt-[15%] text-2xl font-semibold">
          Select a chat
        </p>
      </div>
    );
  }

  const selectedTeam = selectedChat.type === 'team' 
    ? dmAndTeam.teams.find((t) => t.id === selectedChat.id) 
    : null;

  const selectedFriend = selectedChat.type === 'direct'
    ? dmAndTeam.friends.find((u) => u.id === selectedChat.id)
    : null;

  return (<div
    className={`flex-1 flex flex-col ${
      useInProjectPage ? "max-h-[calc(100vh-64px)] min-h-[calc(100vh-64px)]" : "max-h-screen min-h-screen"
    }`}
  >
       {/* Chat Header */}
      <header className="min-h-16 bg-card border-b border-primary px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {selectedChat.type === 'team' ? (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                 style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}>
              <Users className="h-5 w-5" style={{ color: '#8b5cf6' }} />
            </div>
          ) : (
            <Avatar
              className='!w-10 !h-10'
              fullName={selectedChat.name}
              avatar={selectedFriend?.avatar}
              getStatus={true}
              status={isOnline ? 'online' : 'offline'}
            />
          )}
          <div>
            <h2 className="font-semibold text-primary">{selectedChat.name}</h2>
            {selectedChat.type === 'team' && (
              <p className="text-xs text-secondary">
                {selectedTeam?.memberCount} members
              </p>
            )}
          </div>
        </div>
        <ShowTypers selectedChat={selectedChat} />
      </header>

      {/* Messages */}
      <main className="flex-1 h-auto bg-primary overflow-y-auto p-6">
        <div className="space-y-6 w-full relative">
          {/* Load More Button */}
          {pagination?.hasMore && (
            <div className="flex justify-center mb-4">
              <Button
                onClick={loadMoreMessages}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-primary"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Load More Messages (${pagination.totalMessages - messages.length} remaining)`
                )}
              </Button>
            </div>
          )}

          {/* Loading state */}
          {loading && messages.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          )}

          {/* Messages List */}
          {messages.map((msg) => {
            const isCurrentUser = msg.sender.id === currentUser.id;
            
            return (
              <div key={msg.id} className="flex gap-4 max-w-xl">
                <div>
                  <Avatar
                    className="!w-10 !h-10"
                    fullName={msg.sender.fullName}
                    avatar={msg.sender.avatar}
                  />
                  {selectedChat.type === 'direct' && (
                    <div className={`size-3 mt-2 ml-3 rounded-full ${
                      msg.isRead ? 'bg-blue-800' : 'bg-secondary'
                    }`} />
                  )}
                </div>
                
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className={`font-semibold text-primary ${
                      isCurrentUser ? '!text-[#cdc6c6]' : ''
                    }`}>
                      {msg.sender.fullName}
                    </span>
                    <span className="text-xs text-secondary">
                      {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div
                    className="relative chat-message"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowChatOptions((prev) => (prev === msg.id ? null : msg.id));
                    }}
                  >
                    <p className={`text-primary mt-1 break-words whitespace-pre-wrap overflow-hidden max-w-xl rounded-lg p-2 cursor-pointer ${
                      isCurrentUser ? 'bg-[#1f1d1d]' : 'bg-secondary'
                    }`}>
                      {msg.content}
                    </p>

                    {showChatOptions === msg.id && (
                      <div className="absolute left-20 top-full mt-1 w-40 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg z-10 flex flex-col overflow-hidden">
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-[#2a2a2a] text-sm text-primary transition-colors"
                        >
                          <Trash className="h-4 w-4 text-yellow-500" />
                          For me
                        </button>

                        {isCurrentUser && (
                          <button
                            onClick={() => handleDelete(msg.id, true)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-[#2a2a2a] text-sm text-primary transition-colors border-t border-[#2a2a2a]"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                            For everyone
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {!loading && messages.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <p className="text-secondary">No messages yet. Start the conversation!</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <footer className="p-6 bg-card border-t border-primary flex-shrink-0">
        <div className="max-w-screen flex gap-3">
          <Input
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              handleTypingStart();
            }}
            onBlur={handleTypingEnd}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedChat.name}...`}
            className="flex-1 bg-secondary text-primary border-primary"
          />
          <Button onClick={handleSend} size="icon" className="bg-brand hover:opacity-90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default React.memo(ChatComponent, (prevProps, nextProps) => {
  return prevProps.selectedChat?.id === nextProps.selectedChat?.id &&
    prevProps.selectedChat?.type === nextProps.selectedChat?.type;
});