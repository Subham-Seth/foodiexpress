import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderAPI } from '../services/api';
import { VegBadge } from '../components/common/Badge';

const CheckoutPage = () => {
  const { user } = useAuth();
  const {
    cartItems,
    itemsPrice,
    deliveryFee,
    taxPrice,
    discountAmount,
    totalPrice,
    clearCart
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Address form state
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || 'Bengaluru',
    state: user?.address?.state || 'Karnataka',
    postalCode: user?.address?.postalCode || '',
    instructions: ''
  });

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState('COD');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.postalCode) {
      showToast('Please fill in all delivery address fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          foodItem: item._id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
          isVeg: item.isVeg
        })),
        deliveryAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          instructions: formData.instructions
        },
        paymentMethod,
        itemsPrice,
        taxPrice,
        deliveryFee,
        discountAmount,
        totalPrice
      };

      const res = await orderAPI.create(orderPayload);

      if (res.data.success && res.data.data) {
        showToast('Order placed successfully! Redirecting to live tracking...', 'success');
        clearCart();
        navigate(`/order/${res.data.data._id}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Final Step
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
          Checkout & Place Order
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Delivery Details & Payment Choice */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Delivery Address Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Delivery Address</h3>
                  <p className="text-xs text-slate-500">Where should we deliver your hot food?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Street Address & Flat / House No *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Green Glen Heights, Outer Ring Road"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="560001"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    placeholder="e.g. Leave at gate, ring bell twice, call on arrival"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Select Payment Method</h3>
                  <p className="text-xs text-slate-500">Fast, verified and secure payment processing</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Cash on Delivery (COD) */}
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    paymentMethod === 'COD'
                      ? 'border-orange-600 bg-orange-50/50 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-6 h-6 text-emerald-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Cash on Delivery</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Pay in cash or UPI at delivery</p>
                  </div>
                </label>

                {/* Instant UPI Online */}
                <label
                  onClick={() => setPaymentMethod('Online')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    paymentMethod === 'Online'
                      ? 'border-orange-600 bg-orange-50/50 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className="w-6 h-6 text-purple-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === 'Online'}
                      onChange={() => setPaymentMethod('Online')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">UPI / QR Code</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                </label>

                {/* Credit / Debit Card */}
                <label
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    paymentMethod === 'Card'
                      ? 'border-orange-600 bg-orange-50/50 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Credit / Debit Card</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Visa, Mastercard, RuPay</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sticky Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
              <h3 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100">
                Order Review ({cartItems.length} items)
              </h3>

              {/* Items List Preview */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <VegBadge isVeg={item.isVeg} />
                      <span className="font-bold text-slate-800 truncate">
                        {item.qty}x {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs font-medium text-slate-600 pt-4 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-bold text-slate-900">₹{taxPrice}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 text-sm font-black text-slate-900">
                  <span className="text-base">To Pay</span>
                  <span className="text-2xl text-orange-600">₹{totalPrice}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/30 transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Confirming Order...' : `Place Order (₹${totalPrice})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Estimated Delivery in 30-35 mins</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
