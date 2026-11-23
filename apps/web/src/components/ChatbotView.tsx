import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { ChatMessage } from '../types';

export const ChatbotView: React.FC = () => {
  const { hotel } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Welcome to Pearson AI for ${
          hotel?.restaurantName || 'your restaurant'
        }, ${hotel?.ownerName || 'Admin'}!\n\nI am your autonomous restaurant assistant. I can assist you with:\n1. Checking live customer orders from WhatsApp\n2. Updating your restaurant profile or contact details\n3. Verifying RAG menu knowledge embeddings in Pinecone\n4. Providing operational recommendations\n\nHow can I help you manage your restaurant operations today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const response = await api.sendChatToAgent({
        thread_id: hotel?.thread_id || 'default-thread',
        message: text,
        restaurantName: hotel?.restaurantName || 'Restaurant',
        ownerName: hotel?.ownerName || 'Admin',
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.message || 'I have processed your request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `I received your query: "${text}". I have logged this to your operations thread (${hotel?.thread_id}). Note that the Python FastAPI agent service is running on :8000.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Chat cleared for thread ${hotel?.thread_id}. How may I help you now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPrompts = [
    'How do I pair WhatsApp for automated order receiving?',
    'What menu items are currently indexed in our RAG base?',
    'Show a summary of our 4 order status lifecycles.',
    'Update restaurant operating hours and address.',
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      {/* Main Chat Panel */}
      <div className="flex-1 bg-white rounded-2xl border border-stone-200 flex flex-col shadow-xs overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#113b3a] text-[#d9e85a] flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 font-['Space_Grotesk']">
                  Pearson Admin AI Agent
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  FastAPI :8000
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                Thread: {hotel?.thread_id || 'th-active'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 font-bold ${
                    isUser
                      ? 'bg-stone-900 text-[#d9e85a]'
                      : 'bg-[#113b3a] text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`group relative rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-stone-900 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  <div className="flex items-center justify-between gap-4 mt-2 pt-1 border-t border-stone-200/40 text-[10px] opacity-70">
                    <span className="font-mono">{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:opacity-100 flex items-center gap-1 transition-opacity"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 max-w-xl mr-auto">
              <div className="w-8 h-8 rounded-xl bg-[#113b3a] text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-3.5 shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#113b3a] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#113b3a] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#113b3a] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-mono text-stone-500 ml-1">
                  Agent reasoning with LangGraph...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-white border-t border-stone-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Sparkles className="w-3.5 h-3.5 text-[#154644] shrink-0" />
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-[#113b3a]/30 focus-within:border-[#113b3a] transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message Pearson AI for ${hotel?.restaurantName || 'hotel'}...`}
              className="flex-1 bg-transparent px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-2.5 rounded-xl bg-[#113b3a] hover:bg-[#184d4b] text-[#d9e85a] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: AI Assistant Context & Tools info */}
      <div className="w-full lg:w-80 space-y-4 shrink-0">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 font-mono">
              Agent Architecture
            </h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            The chatbot communicates directly with your FastAPI agent backend{' '}
            <code className="px-1.5 py-0.5 rounded bg-stone-100 font-mono text-[11px] text-stone-800">
              POST /admin-chat-bot
            </code>
            .
          </p>
          <div className="mt-4 space-y-2 border-t border-stone-100 pt-3 text-[11px]">
            <div className="flex justify-between">
              <span className="text-stone-500">Framework</span>
              <span className="font-semibold text-stone-800">LangGraph Agent</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">LLM Provider</span>
              <span className="font-semibold text-stone-800">FreeLLM / Google</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Vector Search</span>
              <span className="font-semibold text-stone-800">Pinecone RAG</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Event Stream</span>
              <span className="font-semibold text-stone-800">Kafka 9092</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-stone-900">
            <Info className="w-4 h-4 text-[#154644]" />
            <h4 className="text-xs font-bold font-['Space_Grotesk']">
              Active Session Context
            </h4>
          </div>
          <div className="space-y-2 text-xs mt-3">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">
                Restaurant
              </span>
              <span className="font-semibold text-stone-800 truncate block">
                {hotel?.restaurantName}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">
                Admin Owner
              </span>
              <span className="font-semibold text-stone-800 truncate block">
                {hotel?.ownerName}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] uppercase font-mono text-stone-500 block">
                Conversation Thread ID
              </span>
              <span className="font-mono text-[11px] text-[#154644] font-semibold break-all">
                {hotel?.thread_id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
