import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import CartItemRow from '../components/cart/CartItemRow';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const {
    cartItems,
    itemsCount,
    itemsPrice,
    deliveryFee,
    taxPrice,
    discountAmount,
    totalPrice,
    couponCode,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyCoupon(promoInput.trim());
      setPromoInput('');
    }
  };

  const freeDeliveryThreshold = 499;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - itemsPrice);
  const deliveryProgress = Math.min(100, Math.round((itemsPrice / freeDeliveryThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added any scrumptious food to your bag yet.
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
        >
          <span>Explore Delicious Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Review Your Order
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Shopping Cart ({itemsCount} items)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2 text-slate-800">
            <Truck className="w-4 h-4 text-orange-600" />
            {amountNeededForFreeDelivery === 0 ? (
              <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> You've unlocked FREE Delivery!
              </span>
            ) : (
              <span>
                Add <span className="text-orange-600">₹{amountNeededForFreeDelivery}</span> more for FREE delivery
              </span>
            )}
          </div>
          <span className="text-slate-400">{deliveryProgress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              deliveryProgress >= 100 ? 'bg-emerald-500' : 'bg-orange-500'
            }`}
            style={{ width: `${deliveryProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Item List & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Item Rows */}
        <div className="lg:col-span-8 space-y-3">
          {cartItems.map((item) => (
            <CartItemRow
              key={item._id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Right: Price Summary & Checkout Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Promo Code Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Promo Code
              </label>
              {couponCode ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{couponCode} Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 hover:text-rose-800 p-1 font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="FOODIE10 or WELCOME50"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Line Items */}
            <div className="space-y-3 text-xs font-medium text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{itemsPrice}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Restaurant GST & Taxes (5%)</span>
                <span className="font-bold text-slate-900">₹{taxPrice}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Special Discount</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-4 border-t border-slate-100 text-sm font-black text-slate-900">
                <span className="text-base">Grand Total</span>
                <span className="text-2xl text-orange-600">₹{totalPrice}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate(user ? '/checkout' : '/login?redirect=checkout')}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/30 transition-transform hover:scale-102 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe & Secure 256-Bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
