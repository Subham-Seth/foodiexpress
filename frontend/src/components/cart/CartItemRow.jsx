import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { VegBadge } from '../common/Badge';

const CartItemRow = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 transition-colors gap-3">
      {/* Thumbnail & Info */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <VegBadge isVeg={item.isVeg} />
            <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
          </div>
          <p className="text-xs text-slate-500">
            ₹{item.price} each
          </p>
        </div>
      </div>

      {/* Quantity & Subtotal */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Quantity Controls */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => onUpdateQuantity(item._id, -1)}
            className="w-7 h-7 flex items-center justify-center bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg shadow-xs transition-colors"
            title="Decrease"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-800">
            {item.qty}
          </span>
          <button
            onClick={() => onUpdateQuantity(item._id, 1)}
            className="w-7 h-7 flex items-center justify-center bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg shadow-xs transition-colors"
            title="Increase"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[70px]">
          <span className="text-sm font-black text-slate-900">
            ₹{Math.round(item.price * item.qty * 100) / 100}
          </span>
        </div>

        {/* Remove Action */}
        <button
          onClick={() => onRemove(item._id)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
