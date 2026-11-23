import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Hotel,
  ShoppingBag,
  Sparkles,
  LogOut,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveTab = 'overview' | 'chatbot' | 'hotel' | 'orders' | 'rag';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingOrdersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingOrdersCount,
}) => {
  const { hotel, logout } = useAuth();

  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'chatbot' as ActiveTab,
      label: 'AI Chatbot',
      icon: MessageSquare,
      badge: 'Live',
    },
    {
      id: 'orders' as ActiveTab,
      label: 'Orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : null,
      badgeColor: 'bg-amber-400 text-stone-900',
    },
    {
      id: 'hotel' as ActiveTab,
      label: 'Hotel Data',
      icon: Hotel,
      badge: null,
    },
    {
      id: 'rag' as ActiveTab,
      label: 'Menu & RAG Base',
      icon: Database,
      badge: 'Pinecone',
      badgeColor: 'bg-emerald-400 text-stone-900',
    },
  ];

  return (
    <aside className="w-64 bg-[#113b3a] text-stone-200 flex flex-col h-screen select-none border-r border-[#1a4f4d] shadow-xl">
      {/* Brand Header */}
      <div className="p-6 pb-4 border-b border-[#1b4d4b]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#d9e85a] text-[#113b3a] font-bold text-xl flex items-center justify-center shadow-md font-['Space_Grotesk']">
            P
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk'] leading-tight">
              PEARSON
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-wider text-[#90b2a7]">
              Autonomous Hotel AI
            </p>
          </div>
        </div>

        {/* Current Hotel Workspace Pill */}
        <div className="mt-5 p-3 rounded-xl bg-[#174644] border border-[#235855] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#27635f] text-emerald-200 flex items-center justify-center font-semibold text-xs shrink-0">
            {hotel?.restaurantName ? hotel.restaurantName.charAt(0).toUpperCase() : 'H'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xs font-semibold text-stone-100 truncate">
              {hotel?.restaurantName || 'Hotel Workspace'}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-stone-400 truncate">
                WhatsApp Linked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#7ea599] px-3 mb-2 font-medium">
          Workspace Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 text-left ${
                isActive
                  ? 'bg-[#275a57] text-white shadow-sm ring-1 ring-[#d9e85a]/40 font-semibold'
                  : 'text-[#adc4bd] hover:bg-[#184846] hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#d9e85a]' : 'text-[#7ea599]'
                }`}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.badgeColor || 'bg-[#1e5350] text-[#cbe296]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-[#d9e85a] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Help & RAG Status Strip */}
      <div className="px-4 py-3">
        <div className="bg-[#174644] rounded-xl p-3 border border-[#215452] flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#27635f] text-[#d9e85a]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">LangGraph & RAG</p>
            <p className="text-[10px] text-stone-300">FastAPI Agent :8000</p>
          </div>
        </div>
      </div>

      {/* User / Footer */}
      <div className="p-4 border-t border-[#1b4d4b] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#e3d1be] text-[#5c3e2e] font-bold text-xs flex items-center justify-center uppercase shrink-0">
            {hotel?.ownerName ? hotel.ownerName.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-stone-100 truncate">
              {hotel?.ownerName || 'Hotel Admin'}
            </p>
            <p className="text-[10px] text-stone-400 truncate">
              {hotel?.email || 'Administrator'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-2 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-[#1f4a47] transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
