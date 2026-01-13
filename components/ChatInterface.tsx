import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, disabled }) => {
  const [inputText, setInputText] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || disabled || cooldown > 0) return;

    onSendMessage(inputText);
    setInputText('');
    setCooldown(30); // 30s slow mode delay
  };

  return (
    <div className="flex flex-col h-full bg-black/80 border-t border-gray-800 backdrop-blur-sm">
      {/* Chat Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm scrollbar-hide"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`${msg.isSystem ? 'text-yellow-400 italic' : 'text-gray-200'}`}>
            <span className={`font-bold ${msg.isSystem ? 'text-yellow-500' : 'text-pink-500'}`}>
              {msg.isSystem ? '[SYSTEM]' : `${msg.user}:`}
            </span>{' '}
            <span className="break-words opacity-90">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-2 bg-gray-900/90 border-t border-gray-700 flex gap-2">
        <div className="relative flex-1">
            <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={disabled || cooldown > 0}
            placeholder={disabled ? "Stream Offline" : cooldown > 0 ? `Slow mode: ${cooldown}s` : "Type a message to Aiko..."}
            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-pink-500 disabled:opacity-50"
            />
            {cooldown > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {cooldown}
                </div>
            )}
        </div>
        <button
          type="submit"
          disabled={disabled || !inputText.trim() || cooldown > 0}
          className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-700 text-white p-2 rounded transition-colors flex items-center justify-center min-w-[40px]"
        >
          <Send size={18} />
        </button>
      </form>
      <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
    </div>
  );
};

export default ChatInterface;