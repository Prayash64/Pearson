import React from 'react';
import {
  Sparkles,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { ActiveTab } from './Sidebar';

interface TopbarProps {
  activeTab: ActiveTab;
  onSimulateOrder: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  onSimulateOrder,
  setActiveTab,
}) => {
  const { hotel } = useAuth();

  const tabTitles: Record<ActiveTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Operations Dashboard',
      subtitle: 'Real-time overview of orders, agent status, and hotel metrics',
    },
    chatbot: {
      title: 'Autonomous Assistant Chat',
      subtitle: 'Direct interaction with your restaurant AI agent via thread_id',
    },
    orders: {
      title: 'Guest Orders Pipeline',
      subtitle: 'Accept or reject orders and transition through the 4 state lifecycles',
    },
    hotel: {
      title: 'Hotel & Restaurant Data',
      subtitle: 'Manage property information, contacts, and credentials',
    },
    rag: {
      title: 'Menu Knowledge Base (RAG)',
      subtitle: 'Upload menu documents to index into Pinecone vector storage for LLM retrieval',
    },
  };

  const current = tabTitles[activeTab];

  return (
    <header className="h-18 px-8 bg-white border-b border-stone-200 flex items-center justify-between shrink-0 shadow-xs">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-stone-600">
          <span>{hotel?.restaurantName || 'Workspace'}</span>
          <span>/</span>
          <span className="text-[#154644] font-semibold uppercase tracking-wider">
            {activeTab}
          </span>
        </div>
        <h1 className="text-lg font-bold text-stone-900 font-['Space_Grotesk'] leading-tight">
          {current.title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* WhatsApp & Agent Status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>WhatsApp Online</span>
          <span className="text-emerald-400">·</span>
          <span className="font-mono text-[11px] text-emerald-700">
            {hotel?.phoneNumber || 'Receiver Active'}
          </span>
        </div>

        {/* Quick action button to simulate order */}
        <button
          onClick={onSimulateOrder}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold transition-all shadow-xs"
        >
          <PlusCircle className="w-4 h-4 text-[#d9e85a]" />
          <span>Simulate Guest Order</span>
        </button>

        {/* Quick link to Chatbot */}
        {activeTab !== 'chatbot' && (
          <button
            onClick={() => setActiveTab('chatbot')}
            className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-[#113b3a] transition-colors"
            title="Open AI Chatbot"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </button>
        )}
      </div>
    </header>
  );
};
