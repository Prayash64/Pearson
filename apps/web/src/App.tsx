import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar, type ActiveTab } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { OverviewView } from './components/OverviewView';
import { ChatbotView } from './components/ChatbotView';
import { HotelDataView } from './components/HotelDataView';
import { OrdersView } from './components/OrdersView';
import { MenuRagView } from './components/MenuRagView';
import { LoginView } from './components/LoginView';
import { INITIAL_ORDERS } from './services/api';
import type { Order, OrderStatus } from './types';
import { Plus, X, ShoppingBag } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { isAuthenticated, hotel } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);

  // New simulated order form state
  const [newOrderCustomer, setNewOrderCustomer] = useState('Sarah Jenkins');
  const [newOrderRoom, setNewOrderRoom] = useState('Suite 512');
  const [newOrderItems, setNewOrderItems] = useState('1x Truffle Risotto ($28), 1x Chilean Sea Bass ($42)');
  const [newOrderPrice, setNewOrderPrice] = useState('70');
  const [newOrderNotes, setNewOrderNotes] = useState('Guest requested extra olive oil on the side.');

  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Handle Order Status updates across the 4 states
  const handleUpdateOrderStatus = (orderId: string | number, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  // Quick Accept (pending -> accepted)
  const handleAcceptOrder = (orderId: string | number) => {
    handleUpdateOrderStatus(orderId, 'accepted');
  };

  // Quick Reject (-> rejected)
  const handleRejectOrder = (orderId: string | number) => {
    handleUpdateOrderStatus(orderId, 'rejected');
  };

  // Submit simulated order
  const handleCreateSimulatedOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const itemsList = newOrderItems
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const createdOrder: Order = {
      id: Math.floor(100 + Math.random() * 900),
      username: newOrderCustomer,
      restaurantId: hotel?.id || 1,
      restaurantName: hotel?.restaurantName || 'Pearson Restaurant',
      items: itemsList.length > 0 ? itemsList : ['1x Seasonal Dish ($25)'],
      price: parseFloat(newOrderPrice) || 25,
      orderStatus: 'pending', // Starts in State 1: Pending
      createdAt: new Date().toISOString(),
      tableOrRoom: newOrderRoom,
      notes: newOrderNotes,
    };

    setOrders((prev) => [createdOrder, ...prev]);
    setIsSimulateModalOpen(false);
  };

  const pendingCount = orders.filter((o) => o.orderStatus === 'pending').length;

  return (
    <div className="flex h-screen bg-[#f5f7f5] text-stone-900 overflow-hidden font-['DM_Sans',sans-serif]">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingCount}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          activeTab={activeTab}
          onSimulateOrder={() => setIsSimulateModalOpen(true)}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && (
            <OverviewView
              orders={orders}
              setActiveTab={setActiveTab}
              onAcceptOrder={handleAcceptOrder}
              onRejectOrder={handleRejectOrder}
            />
          )}

          {activeTab === 'chatbot' && <ChatbotView />}

          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onAcceptOrder={handleAcceptOrder}
              onRejectOrder={handleRejectOrder}
              onOpenSimulateModal={() => setIsSimulateModalOpen(true)}
            />
          )}

          {activeTab === 'hotel' && <HotelDataView />}

          {activeTab === 'rag' && <MenuRagView />}
        </main>
      </div>

      {/* Simulate Incoming Order Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#113b3a]" />
                <h3 className="text-base font-bold text-stone-900 font-['Space_Grotesk']">
                  Simulate WhatsApp Guest Order
                </h3>
              </div>
              <button
                onClick={() => setIsSimulateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSimulatedOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Customer / Guest Name
                </label>
                <input
                  type="text"
                  value={newOrderCustomer}
                  onChange={(e) => setNewOrderCustomer(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Room / Table / Delivery
                  </label>
                  <input
                    type="text"
                    value={newOrderRoom}
                    onChange={(e) => setNewOrderRoom(e.target.value)}
                    placeholder="e.g. Suite 404 or Table 9"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Total Amount ($)
                  </label>
                  <input
                    type="number"
                    value={newOrderPrice}
                    onChange={(e) => setNewOrderPrice(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Ordered Items (comma separated)
                </label>
                <input
                  type="text"
                  value={newOrderItems}
                  onChange={(e) => setNewOrderItems(e.target.value)}
                  required
                  placeholder="e.g. 1x Wagyu Burger ($32), 1x Pinot Noir ($19)"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Special Notes / Instructions
                </label>
                <textarea
                  value={newOrderNotes}
                  onChange={(e) => setNewOrderNotes(e.target.value)}
                  rows={2}
                  placeholder="Allergies, timing, door instructions..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSimulateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#113b3a] hover:bg-[#184d4b] text-[#d9e85a] font-bold font-['Space_Grotesk'] flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Emit to Orders Queue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
