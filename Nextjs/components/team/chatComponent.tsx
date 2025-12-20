import { Hash, Send, Users, Loader2, TicketCheckIcon, MessageCircleReply, Trash, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../main/Avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { shallowEqual } from 'react-redux';
import cuid from 'cuid';
import ShowTypers from "./ShowTypers"
import { sendChatMessage, addMessageToCache, setChatMessages, selectChatCache, Message, joinChat, leaveChat, sendMessage, updateMessageReadStatus, deleteMessageFromCache, updateIsFetched } from '@/lib/redux/features/chatSlice';
import { useMemo } from 'react';
import { showToast } from '../main/Toast';
import { fa } from 'zod/v4/locales';
import { DMAndTeamResult } from '@/lib/types/chat';
interface User {
  id: string;
  fullName: string;
  avatar: string;
  username: string;
  status: string;
}

const ChatComponent = ({ selectedChat, dmAndTeam }: { selectedChat: { type: 'team' | 'direct'; id: string; name: string } | null, dmAndTeam: DMAndTeamResult }) => {
  const dispatch = useAppDispatch();
  const u = useAppSelector((state) => state.user, shallowEqual);
  let userTying = useRef(false)
  const [fetchingMessages, setFetchingMessages] = useState(false) // for not letting messageend ref to get scrolled
  const [showChatOptions, setShowChatOptions] = useState<string | null>(null)
  const currentUser: User = { id: u.id, fullName: u.fullName, avatar: u.avatar, username: u.username, status: "online" };
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const isOnline = useAppSelector(
    (state) =>
      selectedChat?.type === 'direct' &&
      state.onlineUser.onlineUsers.includes(
        dmAndTeam.friends.find((u) => u.id === selectedChat?.id)?.userId!
      ),
    shallowEqual
  );
  const defaultChatCache = useMemo(
    () => ({ messages: [], pagination: null, currentPage: 1, isFetched: false }),
    []
  );

  // Get current chat's cached data from Redux
  const currentChatCache = useAppSelector(
    (state) => selectedChat ? selectChatCache(state, selectedChat.type, selectedChat.id) : defaultChatCache,

  );

  const handleDelete = async (msgId: string, forEveryone?: boolean) => {
    if (!selectedChat) return
    dispatch(deleteMessageFromCache({
      chatType: selectedChat?.type,
      chatId: selectedChat?.id,
      messageId: msgId,
    }));
    setShowChatOptions(null)
    const res = await fetch(`/api/chat/messages/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messageId: msgId,
        forEveryone,
        chatId: selectedChat?.id,
        chatType: selectedChat?.type
      })
    })
    const data = await res.json()
    if (data.message == undefined) {
      showToast(false, "Failed to delete message", data.error)
      return
    }
    if (data.message === "Message deleted" && forEveryone) {
      dispatch(sendChatMessage({
        action: "deleteMessage",
        chatType: selectedChat.type,
        chatId: selectedChat.id,
        messageId: msgId,
      }));
    }

  };
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);

  const { messages, pagination, currentPage } = currentChatCache;

  // Update chat cache helper - now uses Redux
  const updateChatCache = (chatType: 'team' | 'direct', chatId: string, updates: { messages: Message[]; pagination: any; currentPage: number }) => {
    dispatch(setChatMessages({
      chatType,
      chatId,
      messages: updates.messages,
      pagination: updates.pagination !== undefined ? updates.pagination : currentChatCache.pagination,
    }));
  };

  // Fetch messages from API
  const fetchMessages = async (page: number = 1) => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/chat/messages/get?chatType=${selectedChat.type}&chatId=${selectedChat.id}&page=${page}&limit=30`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();


      // Update cache
      const updatedMessages = page === 1
        ? data.messages
        : [...data.messages, ...(currentChatCache.messages || [])];

      updateChatCache(selectedChat.type, selectedChat.id, {
        messages: updatedMessages,
        pagination: data.pagination,
        currentPage: page,
      });
      if (page === 1) {
        dispatch(sendChatMessage({
          action: "read",
          chatId: selectedChat.id,
          reciverId: dmAndTeam.friends.find((u) => u.id === selectedChat.id)?.userId,
        }))

      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Load messages when chat changes
  useEffect(() => {
    async function op(selectedChat: { type: 'team' | 'direct'; id: string; name: string }) {
      //a case where there are messages and fetched is false ,this case happen when a chat toast comes and user have not opened the chat ,so we give a update to read in db
      if (currentChatCache.messages.length > 0 && !currentChatCache.isFetched) {
        dispatch(updateIsFetched({
          chatType: selectedChat.type,
          chatId: selectedChat.id,
        }))
        for (let i = messages.length-1; i >= 0; i--) {
          if (messages[i].isRead !== false) break
          console.log(messages[i])
          await fetch(`/api/chat/messages/read`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messageId: messages[i].id,
            })
          })

        }
      }
    }
    if (!selectedChat) return
    // Only fetch if not cached in Redux
    dispatch(joinChat(selectedChat.type, selectedChat.id));
    if (currentChatCache.messages.length === 0 && !currentChatCache.isFetched) {
      fetchMessages(1);
    }
    op(selectedChat)
    if (selectedChat.type === "direct" && currentChatCache.messages.length > 0 && currentChatCache.messages[currentChatCache.messages.length - 1].sender.id !== u.id) {
      dispatch(sendChatMessage({
        action: "read",
        chatId: selectedChat.id,
        reciverId: dmAndTeam.friends.find((u) => u.id === selectedChat.id)?.userId,
      }))
      if (currentChatCache.messages[currentChatCache.messages.length - 1].isRead === false) {
        dispatch(updateMessageReadStatus({ chatId: selectedChat.id, userId: dmAndTeam.friends.find((u) => u.id === selectedChat.id)?.userId! }))
      }
    }
    const handleBeforeUnload = () => {
      if (!selectedChat) return
      dispatch(leaveChat(selectedChat.type, selectedChat.id));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (selectedChat) {
        dispatch(leaveChat(selectedChat.type, selectedChat.id));
        dispatch(sendChatMessage({
          action: 'typingEnd',
          chatId: selectedChat.id,

        }))
      }
    };
  }, [selectedChat?.id, selectedChat?.type]);
  useEffect(() => {
    if (fetchingMessages) {
      setFetchingMessages(false)
      return
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load more messages
  const loadMoreMessages = () => {
    if (pagination && pagination.hasMore && !loading) {
      setFetchingMessages(true)
      fetchMessages(currentPage + 1);
    }
  };

  const handleSend = () => {

    if (messageText.trim() && selectedChat) {
      if (userTying.current) {
        userTying.current = false;
        dispatch(sendChatMessage({
          action: 'typingEnd',
          chatId: selectedChat.id,

        }))
      }
      let id = cuid();
      let createdAt = new Date().toString();
      let updatedAt = new Date().toString();
      dispatch(sendMessage(selectedChat.type, selectedChat.id, id, messageText, createdAt, updatedAt, dmAndTeam.friends.find((u) => u.id === selectedChat.id)?.userId!));
      const newMessage: Message = {
        id: id,
        sender: currentUser,
        content: messageText,
        isRead: false,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };
      // Add message to Redux cache
      dispatch(addMessageToCache({
        chatType: selectedChat.type,
        chatId: selectedChat.id,
        message: newMessage,
      }));

      setMessageText('');
    }
  };

  if (!selectedChat) return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat Header */}
      <div className="h-16 bg-card border-b border-primary px-6 flex items-center gap-4 flex-shrink-0">
      </div>

      <p className="text-primary mx-auto mt-[15%] text-2xl font-semibold">Select a chat</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat Header */}
      <div className="h-16 bg-card border-b border-primary px-6 flex items-center justify-between gap-4 ">
        <div className="flex items-center gap-4">
          {selectedChat.type === 'team' && (
            <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
              <Hash className="h-5 w-5 text-brand" />
            </div>
          )}
          {selectedChat.type === 'team' && (
            <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}>
              <Users className="h-5 w-5 m-auto mt-2.5" style={{ color: '#8b5cf6' }} />
            </div>
          )}
          {selectedChat.type === 'direct' && (
            <Avatar
              className='!w-10 !h-10'
              fullName={selectedChat.name}
              avatar={dmAndTeam.friends.find((u) => u.id === selectedChat.id)?.avatar}
              getStatus={true}
              status={isOnline ? 'online' : 'offline'}
            />
          )}
          <div>
            <h2 className="font-semibold text-primary">{selectedChat.name}</h2>
            {selectedChat.type === 'team' && (
              <p className="text-xs text-secondary">
                {dmAndTeam.teams.find((t) => t.id === selectedChat.id)?.memberCount} members
              </p>
            )}
          </div>
        </div>
        <ShowTypers selectedChat={selectedChat} />
      </div>

      {/* Messages */}
      <div className="flex-1 h-auto bg-primary overflow-y-auto p-6">
        <div className="space-y-6 w-full relative">
          {/* Load More Button */}
          {pagination && pagination.hasMore && (
            <div className="flex justify-center mb-4">
              <Button
                onClick={loadMoreMessages}
                disabled={loading}
                variant="outline"
                size="sm"
                className=" border-primary"
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

          {/* Loading state for initial load */}
          {loading && messages.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          )}

          {/* Messages List */}
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-4 max-w-xl ">
              <div className=''>
                <Avatar
                  className="!w-10 !h-10"
                  fullName={msg.sender.fullName}
                  avatar={msg.sender.avatar}
                />
                {selectedChat.type === 'direct' && <div className={` size-3  mt-2 ml-3 rounded-full  ${msg.isRead ? 'bg-blue-800' : 'bg-secondary'}`} />}
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <span
                    className={`font-semibold text-primary ${msg.sender.id === currentUser.id ? '!text-[#cdc6c6]' : ''
                      }`}
                  >
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
                    e.stopPropagation(); // prevent outside click handler from triggering
                    setShowChatOptions((prev) => (prev === msg.id ? null : msg.id));
                  }}
                >
                  <p
                    className={`text-primary mt-1 break-words whitespace-pre-wrap overflow-hidden max-w-xl rounded-lg p-2 cursor-pointer ${msg.sender.id === currentUser.id ? 'bg-[#1f1d1d]' : 'bg-secondary'
                      }`}
                  >
                    {msg.content}
                  </p>


                  {showChatOptions === msg.id && (
                    <div
                      className="absolute left-20 top-full mt-1 w-40 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg z-10 flex flex-col overflow-hidden"
                    >

                      {/* Delete for me */}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#2a2a2a] text-sm text-primary transition-colors"
                      >
                        <Trash className="h-4 w-4 text-yellow-500" />
                        For me
                      </button>

                      {/* Delete for everyone */}
                      {msg.sender.id === currentUser.id && <button
                        onClick={() => handleDelete(msg.id, true)} // same function for now
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#2a2a2a] text-sm text-primary transition-colors border-t border-[#2a2a2a]"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        For everyone
                      </button>}
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}

          {/* Empty state */}
          {!loading && messages.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <p className="text-secondary">No messages yet. Start the conversation!</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-6 bg-card border-t border-primary flex-shrink-0">
        <div className="max-w-screen flex gap-3">
          <Input

            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value)
              if (userTying.current) return;
              userTying.current = true;
              dispatch(sendChatMessage({
                action: 'typingStart',
                chatId: selectedChat.id,

              }))
            }}

            onBlur={() => {
              if (userTying.current && selectedChat) {
                userTying.current = false;
                dispatch(sendChatMessage({
                  action: "typingEnd",
                  chatId: selectedChat.id,
                }));
              }
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedChat.name}...`}
            className="flex-1  bg-secondary text-primary border-primary"
          />
          <Button onClick={handleSend} size="icon" className="bg-brand hover:opacity-90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ChatComponent,
  (prevProps, nextProps) => {
    return prevProps.selectedChat?.id === nextProps.selectedChat?.id &&
      prevProps.selectedChat?.type === nextProps.selectedChat?.type;
  }
)
