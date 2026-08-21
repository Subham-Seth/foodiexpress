import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCw,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  Phone,
  ChefHat,
  Receipt,
  Truck
} from 'lucide-react';
import OrderTrackerTimeline from '../components/order/OrderTrackerTimeline';
import { PageLoader } from '../components/common/Loader';
import { VegBadge } from '../components/common/Badge';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await orderAPI.getById(id);
      if (res.data.success) {
        setOrder(res.data.data);
        if (isManual) showToast('Order status refreshed', 'success');
      }
    } catch (err) {
      console.error('Failed to load order status', err);
      showToast(err.message || 'Failed to fetch order', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Auto poll every 15 seconds to simulate real-time updates
    const interval = setInterval(() => {
      fetchOrder();
    }, 15000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return <PageLoader message="Tracking live delivery status..." />;
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800">Order not found</h3>
        <Link to="/orders" className="inline-block px-6 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Live Refresher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-orange-600 hover:border-orange-200 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Live Order Tracking</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
          </div>
        </div>

        <button
          onClick={() => fetchOrder(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Updating...' : 'Refresh Status'}</span>
        </button>
      </div>

      {/* Visual Order Progress Stepper */}
      <OrderTrackerTimeline
        orderStatus={order.orderStatus}
        timeline={order.statusTimeline}
        estimatedDeliveryTime={order.estimatedDeliveryTime}
      />

      {/* Two Column Layout: Delivery Info & Itemized Bill */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Details */}
        <div className="md:col-span-7 space-y-6">
          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Delivery Destination</h3>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-900 text-sm">{order.deliveryAddress.fullName}</p>
              <p>{order.deliveryAddress.street}</p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}
              </p>
              <p className="flex items-center gap-1.5 pt-1 text-slate-700 font-semibold">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span>{order.deliveryAddress.phone}</span>
              </p>
              {order.deliveryAddress.instructions && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-[11px] font-medium">
                  <strong>Instructions:</strong> {order.deliveryAddress.instructions}
                </div>
              )}
            </div>
          </div>

          {/* Payment Status Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Payment Details</h3>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Method: {order.paymentMethod}</span>
              {order.isPaid ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  Paid Successfully
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold">
                  Cash on Delivery Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Itemized Receipt */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Receipt className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-slate-900 text-sm">Order Summary</h3>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs font-medium text-slate-600 pt-4 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-bold text-slate-900">₹{order.taxPrice}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- ₹{order.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 text-sm font-black text-slate-900">
                <span className="text-base">Grand Total</span>
                <span className="text-xl text-orange-600">₹{order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
