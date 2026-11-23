import React from 'react';
import {
  Clock,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Database,
  ShoppingBag,
  FileText,
  MessageSquare,
} from 'lucide-react';
import type { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import type { ActiveTab } from './Sidebar';

interface OverviewViewProps {
  orders: Order[];
  setActiveTab: (tab: ActiveTab) => void;
  onAcceptOrder: (id: string | number) => void;
  onRejectOrder: (id: string | number) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  orders,
  setActiveTab,
  onAcceptOrder,
  onRejectOrder,
}) => {
  const { hotel } = useAuth();

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending');
  const acceptedOrders = orders.filter((o) => o.orderStatus === 'accepted');
  const readyOrders = orders.filter((o) => o.orderStatus === 'ready');
  const completedOrders = orders.filter((o) => o.orderStatus === 'completed');

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'rejected')
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#113b3a] to-[#1c5553] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm border border-[#215754]">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#d9e85a] uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Hospitality Agent</span>
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] mt-1 text-white">
            Welcome back, {hotel?.ownerName || 'Manager'}
          </h2>
          <p className="text-xs text-[#b8d4cc] mt-1 max-w-xl">
            {hotel?.restaurantName} is connected to the WhatsApp AI receiver and
            LangGraph agent. {pendingOrders.length} new orders need your approval today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className="px-4 py-2 rounded-xl bg-[#d9e85a] hover:bg-[#cbe046] text-[#113b3a] text-xs font-bold font-['Space_Grotesk'] flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
          >
            <span>Review Orders ({pendingOrders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className="px-4 py-2 rounded-xl bg-[#235855] hover:bg-[#2c6d69] text-white text-xs font-semibold flex items-center gap-2 transition-colors border border-[#327470]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#d9e85a]" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* 4 Order State KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* State 1: Pending */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">1. Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900 font-['Space_Grotesk']">
              {pendingOrders.length}
            </span>
            <span className="text-xs font-medium text-amber-600">Awaiting Action</span>
          </div>
          <p className="text-[11px] text-stone-600 mt-2">
            Incoming WhatsApp orders needing acceptance or rejection.
          </p>
        </div>

        {/* State 2: Accepted */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">2. In Preparation</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900 font-['Space_Grotesk']">
              {acceptedOrders.length}
            </span>
            <span className="text-xs font-medium text-blue-600">Cooking & Packing</span>
          </div>
          <p className="text-[11px] text-stone-600 mt-2">
            Orders confirmed and sent to kitchen prep.
          </p>
        </div>

        {/* State 3: Ready */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">3. Ready for Service</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900 font-['Space_Grotesk']">
              {readyOrders.length}
            </span>
            <span className="text-xs font-medium text-purple-600">Ready to Deliver</span>
          </div>
          <p className="text-[11px] text-stone-600 mt-2">
            Plated or packed, ready for delivery or room service.
          </p>
        </div>

        {/* State 4: Completed */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">4. Completed Orders</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-stone-900 font-['Space_Grotesk']">
              {completedOrders.length}
            </span>
            <span className="text-xs font-medium text-emerald-600">
              ${totalRevenue.toLocaleString()} volume
            </span>
          </div>
          <p className="text-[11px] text-stone-600 mt-2">
            Successfully delivered to guests and finalized.
          </p>
        </div>
      </div>

      {/* Main Split Section: Pending Orders & AI Chat Quick Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pending Orders List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900 font-['Space_Grotesk']">
                Active Orders Action Queue
              </h3>
              <p className="text-xs text-stone-500">
                Review and quickly accept or reject incoming guest orders.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-semibold text-[#154644] hover:text-[#236b68] flex items-center gap-1"
            >
              <span>View All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100 mt-2">
            {orders.slice(0, 4).map((order) => {
              const isPending = order.orderStatus === 'pending';
              return (
                <div
                  key={order.id}
                  className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-stone-50/70 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center font-mono font-bold text-xs text-stone-700">
                      #{order.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-stone-900">
                          {order.username}
                        </h4>
                        {order.tableOrRoom && (
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-mono text-stone-600 font-medium">
                            {order.tableOrRoom}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {order.items.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-mono font-bold text-stone-900">
                      ${order.price}
                    </span>

                    {/* Order Status Badge */}
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold ${
                        order.orderStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : order.orderStatus === 'accepted'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'ready'
                          ? 'bg-purple-100 text-purple-800'
                          : order.orderStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                    {/* Quick Accept/Reject for Pending */}
                    {isPending && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onAcceptOrder(order.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onRejectOrder(order.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side Cards */}
        <div className="space-y-6">
          {/* AI Chatbot Teaser */}
          <div className="p-6 rounded-2xl bg-[#f0f6f2] border border-[#d2e4d9] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#113b3a] text-[#d9e85a] flex items-center justify-center shadow-xs mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#113b3a] font-['Space_Grotesk']">
                Pearson AI Assistant
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Integrated with LangGraph and RAG. Ask questions about your menu items,
                view order summaries, or run operations commands.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('chatbot')}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-[#113b3a] hover:bg-[#184d4b] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Open Chat Interface</span>
              <ArrowRight className="w-4 h-4 text-[#d9e85a]" />
            </button>
          </div>

          {/* RAG Knowledge Status */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 font-mono">
                  Menu RAG Vector Store
                </h4>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-stone-600">
              Pinecone index holds your uploaded menu documents and dishes. Used to answer
              customer queries autonomously on WhatsApp.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Vector Embeddings</span>
              <span className="font-mono font-bold text-emerald-700">1,536 Dim Ready</span>
            </div>
            <button
              onClick={() => setActiveTab('rag')}
              className="mt-3 w-full py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>Manage Menu Knowledge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
