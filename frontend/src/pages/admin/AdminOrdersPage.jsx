import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  Eye,
  CheckCircle,
  X,
  Phone,
  MapPin,
  RotateCw,
  Search,
  Filter
} from 'lucide-react';
import { OrderStatusBadge, VegBadge } from '../../components/common/Badge';
import { PageLoader } from '../../components/common/Loader';
import { orderAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminOrdersPage = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const params = {};
      if (selectedStatus !== 'all') params.status = selectedStatus;
      const res = await orderAPI.getAllAdmin(params);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await orderAPI.updateStatus(orderId, { status: newStatus });
      if (res.data.success) {
        showToast(`Order updated to: ${newStatus}`, 'success');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.data);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <PageLoader message="Loading orders queue..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Kitchen & Delivery Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Live Orders Queue ({orders.length})
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {[
          { label: 'All Orders', value: 'all' },
          { label: 'Placed', value: 'Order Placed' },
          { label: 'Confirmed', value: 'Confirmed' },
          { label: 'Preparing', value: 'Preparing' },
          { label: 'Out for Delivery', value: 'Out for Delivery' },
          { label: 'Delivered', value: 'Delivered' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedStatus === tab.value
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 block">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{order.deliveryAddress?.fullName || order.user?.name}</p>
                    <p className="text-[10px] text-slate-400">{order.deliveryAddress?.phone || order.user?.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-700 block">
                      {order.orderItems?.length || 0} Item(s)
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {order.orderItems?.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">
                    ₹{order.totalPrice}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.paymentMethod} {order.isPaid ? '(Paid)' : '(Unpaid)'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updatingId === order._id}
                      className="p-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Full Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">
                    Order #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h3>
                  <OrderStatusBadge status={selectedOrder.orderStatus} />
                </div>
                <p className="text-xs text-slate-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <h4 className="font-bold text-slate-800">Customer & Delivery Info</h4>
              <p><strong>Name:</strong> {selectedOrder.deliveryAddress?.fullName}</p>
              <p><strong>Phone:</strong> {selectedOrder.deliveryAddress?.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city} - {selectedOrder.deliveryAddress?.postalCode}</p>
              {selectedOrder.deliveryAddress?.instructions && (
                <p className="text-amber-700"><strong>Note:</strong> {selectedOrder.deliveryAddress?.instructions}</p>
              )}
            </div>

            {/* Dishes Ordered */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Dishes in this Order
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-bold text-slate-800">{item.qty}x {item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">₹{selectedOrder.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery:</span>
                <span className="font-bold text-slate-800">₹{selectedOrder.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST:</span>
                <span className="font-bold text-slate-800">₹{selectedOrder.taxPrice}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span>- ₹{selectedOrder.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Grand Total:</span>
                <span className="text-purple-600">₹{selectedOrder.totalPrice}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
