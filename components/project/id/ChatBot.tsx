
import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '@/lib/types';

interface ChatBotProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="bg-secondary border-l border-primary h-full flex flex-col">
      <div className="p-3 border-b border-primary">
        <h2 className="text-primary font-medium flex items-center space-x-2">
          <Bot className="w-5 h-5 text-brand" />
          <span>Code Assistant</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-brand text-white'
                  : 'bg-card text-primary'
              }`}
            >
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 mt-0.5" />
                  ) : (
                    <Bot className="w-4 h-4 mt-0.5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-secondary'
                  }`}>
                    {"12:05"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-primary">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about your code..."
            className="flex-1 bg-card border border-primary rounded px-3 py-2 text-primary placeholder-muted focus:outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-brand hover:bg-brand/80 disabled:bg-border-primary disabled:cursor-not-allowed px-3 py-2 rounded text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;