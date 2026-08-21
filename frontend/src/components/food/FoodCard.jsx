import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Clock, Flame, Star, ShoppingBag } from 'lucide-react';
import { VegBadge, SpicyBadge } from '../common/Badge';
import StarRating from '../common/StarRating';
import { useCart } from '../../context/CartContext';

const FoodCard = ({ food }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const inCart = cartItems.find((item) => item._id === food._id);

  const discountPercent =
    food.discountedPrice > 0 && food.discountedPrice < food.price
      ? Math.round(((food.price - food.discountedPrice) / food.price) * 100)
      : 0;

  const currentPrice = food.discountedPrice > 0 ? food.discountedPrice : food.price;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100/80 hover:border-orange-200 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container with Badges */}
      <div className="relative overflow-hidden aspect-4/3 bg-slate-100">
        <Link to={`/food/${food._id}`} className="block w-full h-full">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Veg/Non-veg top-left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <div className="bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs">
            <VegBadge isVeg={food.isVeg} />
          </div>
          {food.isSpicy && (
            <div className="bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-rose-600 shadow-xs flex items-center gap-0.5">
              <Flame className="w-3 h-3 fill-rose-500 text-rose-500" /> Spicy
            </div>
          )}
        </div>

        {/* Discount Tag top-right */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
            {discountPercent}% OFF
          </div>
        )}

        {/* Prep Time bottom-left */}
        <div className="absolute bottom-2.5 left-3 bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{food.prepTimeMinutes || 20} mins</span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wide uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              {food.categoryName || food.category?.name || 'Delicacy'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-800">
                {food.rating ? Number(food.rating).toFixed(1) : '4.8'}
              </span>
              <span className="text-[10px] text-slate-400">
                ({food.numReviews || 0})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/food/${food._id}`}
            className="block text-base font-bold text-slate-900 hover:text-orange-600 transition-colors line-clamp-1 leading-snug"
          >
            {food.name}
          </Link>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900">
                ₹{currentPrice}
              </span>
              {food.discountedPrice > 0 && food.discountedPrice < food.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{food.price}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {food.calories ? `${food.calories} kcal` : 'Freshly made'}
            </span>
          </div>

          {/* Add / Quantity Button */}
          {inCart ? (
            <div className="flex items-center bg-orange-600 text-white rounded-xl shadow-sm p-1">
              <button
                onClick={() => updateQuantity(food._id, -1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-orange-700 rounded-lg transition-colors"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold">
                {inCart.qty}
              </span>
              <button
                onClick={() => updateQuantity(food._id, 1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-orange-700 rounded-lg transition-colors"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(food)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-xs group/btn"
            >
              <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
