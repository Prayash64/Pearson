import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
  Receipt,
  Eye,
  Check,
  X,
  Plus,
  Truck,
} from 'lucide-react';
import type { Order, OrderStatus } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string | number, newStatus: OrderStatus) => void;
  onAcceptOrder: (orderId: string | number) => void;
  onRejectOrder: (orderId: string | number) => void;
  onOpenSimulateModal: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onUpdateStatus,
  onAcceptOrder,
  onRejectOrder,
  onOpenSimulateModal,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectingOrderId, setRejectingOrderId] = useState<string | number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // 4 Primary Operational States as requested
  const orderStates: { id: OrderStatus; label: string; step: number; color: string }[] = [
    { id: 'pending', label: '1. Pending Review', step: 1, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'accepted', label: '2. In Kitchen Prep', step: 2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'ready', label: '3. Ready for Service', step: 3, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'completed', label: '4. Delivered / Done', step: 4, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesTab = filterTab === 'all' ? true : order.orderStatus === filterTab;
    const matchesSearch =
      order.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.tableOrRoom && order.tableOrRoom.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(order.id).includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" />
            1. Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <ShoppingBag className="w-3 h-3" />
            2. In Prep
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Truck className="w-3 h-3" />
            3. Ready
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            4. Completed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
    }
  };

  const handleConfirmReject = () => {
    if (rejectingOrderId !== null) {
      onRejectOrder(rejectingOrderId);
      setRejectingOrderId(null);
      setRejectReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 State Workflow Header Progress Strip */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-['Space_Grotesk']">
              The 4 Order Lifecycles
            </h3>
            <p className="text-xs text-stone-500">
              Orders placed by customers via WhatsApp flow through these four sequential operational states.
            </p>
          </div>
          <button
            onClick={onOpenSimulateModal}
            className="px-3.5 py-2 rounded-xl bg-[#113b3a] hover:bg-[#184d4b] text-[#d9e85a] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Simulated Order</span>
          </button>
        </div>

        {/* 4 Stepper Pipeline Visual */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {orderStates.map((state) => {
            const count = orders.filter((o) => o.orderStatus === state.id).length;
            const isSelected = filterTab === state.id;
            return (
              <button
                key={state.id}
                onClick={() => setFilterTab(state.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/60 text-stone-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase font-bold ${isSelected ? 'text-[#d9e85a]' : 'text-stone-500'}`}>
                    State {state.step}
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-800'}`}>
                    {count}
                  </span>
                </div>
                <div className="font-semibold text-xs mt-1 truncate">
                  {state.label.replace(/^\d+\.\s*/, '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'pending'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pending ({orders.filter((o) => o.orderStatus === 'pending').length})
          </button>
          <button
            onClick={() => setFilterTab('accepted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'accepted'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            In Prep ({orders.filter((o) => o.orderStatus === 'accepted').length})
          </button>
          <button
            onClick={() => setFilterTab('ready')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'ready'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Ready ({orders.filter((o) => o.orderStatus === 'ready').length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'completed'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Completed ({orders.filter((o) => o.orderStatus === 'completed').length})
          </button>
          <button
            onClick={() => setFilterTab('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'rejected'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rejected ({orders.filter((o) => o.orderStatus === 'rejected').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest or item..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#113b3a]/30 focus:border-[#113b3a]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-semibold text-stone-700">No orders found</p>
            <p className="text-xs text-stone-400 mt-1">
              Try choosing another filter tab or simulate a new WhatsApp order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-5 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Guest & Room</th>
                  <th className="py-3.5 px-4 font-semibold">Ordered Items</th>
                  <th className="py-3.5 px-4 font-semibold">Total</th>
                  <th className="py-3.5 px-4 font-semibold">Order Status (4 States)</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => {
                  const isPending = order.orderStatus === 'pending';
                  return (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* ID & Time */}
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-stone-900 block">
                          #{order.id}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Guest & Room */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-stone-900 block truncate max-w-[150px]">
                          {order.username}
                        </span>
                        <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          {order.tableOrRoom || 'WhatsApp Guest'}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-stone-700 truncate font-medium">
                          {order.items.join(', ')}
                        </div>
                        {order.notes && (
                          <div className="text-[10px] text-amber-600 truncate mt-0.5 italic">
                            "{order.notes}"
                          </div>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 font-mono font-bold text-stone-900">
                        ${order.price}
                      </td>

                      {/* 4-State Status Pill + Dropdown Selector */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.orderStatus)}

                          {/* Quick State Transition Selector */}
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              onUpdateStatus(order.id, e.target.value as OrderStatus)
                            }
                            className="text-[11px] font-mono py-1 px-2 border border-stone-200 rounded-lg bg-white text-stone-700 hover:border-stone-400 focus:outline-none cursor-pointer"
                          >
                            <option value="pending">1. Pending</option>
                            <option value="accepted">2. In Prep</option>
                            <option value="ready">3. Ready</option>
                            <option value="completed">4. Completed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Accept/Reject for Pending */}
                          {isPending && (
                            <>
                              <button
                                onClick={() => onAcceptOrder(order.id)}
                                title="Accept Order"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </button>
                              <button
                                onClick={() => setRejectingOrderId(order.id)}
                                title="Reject Order"
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {/* View details */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            title="Inspect Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Order Confirmation Dialog */}
      {rejectingOrderId !== null && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-fadeIn">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-['Space_Grotesk']">
                  Reject Order #{rejectingOrderId}
                </h3>
                <p className="text-xs text-stone-500">
                  This will notify the customer via WhatsApp that their order cannot be fulfilled.
                </p>
              </div>
            </div>

            <div className="my-4">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reason for Rejection (Optional)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Kitchen item out of stock, closing early..."
                className="w-full p-2.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#113b3a]" />
                <h3 className="text-base font-bold text-stone-900 font-['Space_Grotesk']">
                  Order Details #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">
                    Customer Name
                  </span>
                  <span className="font-semibold text-stone-900">{selectedOrder.username}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">
                    Location / Table
                  </span>
                  <span className="font-semibold text-stone-900">
                    {selectedOrder.tableOrRoom || 'Takeaway'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">
                    Order Timestamp
                  </span>
                  <span className="font-mono text-stone-700">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-400 block">
                    Current Status
                  </span>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
              </div>

              {/* Items List */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block mb-2">
                  Line Items
                </span>
                <ul className="space-y-1.5 text-xs text-stone-800">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center py-1 border-b border-stone-100 last:border-0">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 mt-2 border-t border-stone-200 flex justify-between items-center font-bold text-stone-900 text-sm">
                  <span>Total Amount</span>
                  <span className="font-mono">${selectedOrder.price}</span>
                </div>
              </div>

              {/* State Transition Actions */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  Change State (4 Operational Phases):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedOrder.id, 'pending');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'pending' });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                      selectedOrder.orderStatus === 'pending'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    1. Set Pending
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedOrder.id, 'accepted');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'accepted' });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                      selectedOrder.orderStatus === 'accepted'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    2. Set In Prep
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedOrder.id, 'ready');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'ready' });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                      selectedOrder.orderStatus === 'ready'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    3. Set Ready
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedOrder.id, 'completed');
                      setSelectedOrder({ ...selectedOrder, orderStatus: 'completed' });
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                      selectedOrder.orderStatus === 'completed'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                    }`}
                  >
                    4. Set Completed
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
