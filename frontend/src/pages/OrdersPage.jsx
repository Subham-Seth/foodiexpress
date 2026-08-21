import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  ChevronRight,
  Calendar,
  CreditCard,
  UtensilsCrossed,
  RotateCw
} from 'lucide-react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { OrderStatusBadge, VegBadge } from '../components/common/Badge';
import { PageLoader } from '../components/common/Loader';

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=orders');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        if (res.data.success) {
          setOrders(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, navigate]);

  if (loading) {
    return <PageLoader message="Loading your order history..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Orders Placed Yet</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven't ordered anything yet. Browse our delicious menu and treat yourself today!
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
        >
          <span>Explore Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Order Tracking
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
          My Past & Active Orders
        </h1>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs hover:border-orange-200 transition-all space-y-4"
          >
            {/* Header info row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Order ID:</span>
                  <span className="text-xs font-black text-slate-800 font-mono">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Action Button */}
              <Link
                to={`/order/${order._id}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <span>Track Live Progress</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Order Items Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-slate-800 truncate">{item.name}</h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Qty: {item.qty} × ₹{item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom pricing row */}
            <div className="flex items-center justify-between pt-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span>Payment: <strong className="text-slate-800">{order.paymentMethod}</strong></span>
                {order.isPaid ? (
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">Paid</span>
                ) : (
                  <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">Pay on Delivery</span>
                )}
              </div>

              <div className="text-right">
                <span className="text-slate-400 mr-2">Total Paid:</span>
                <span className="text-base font-black text-slate-900">₹{order.totalPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
