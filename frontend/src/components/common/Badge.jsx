import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export const VegBadge = ({ isVeg }) => {
  return (
    <div
      className={`inline-flex items-center justify-center w-4 h-4 border ${
        isVeg ? 'border-emerald-600' : 'border-rose-600'
      } p-0.5 rounded-sm bg-white shrink-0 shadow-xs`}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isVeg ? 'bg-emerald-600' : 'bg-rose-600'
        }`}
      />
    </div>
  );
};

export const SpicyBadge = ({ isSpicy }) => {
  if (!isSpicy) return null;
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold bg-rose-50 text-rose-600 rounded-md border border-rose-100">
      <Flame className="w-3 h-3 fill-rose-500 text-rose-500" /> Spicy
    </span>
  );
};

export const OrderStatusBadge = ({ status }) => {
  const statusStyles = {
    'Order Placed': 'bg-blue-50 text-blue-700 border-blue-200',
    'Confirmed': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Preparing': 'bg-amber-50 text-amber-700 border-amber-200',
    'Out for Delivery': 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse',
    'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Cancelled': 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${
        statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {status}
    </span>
  );
};
