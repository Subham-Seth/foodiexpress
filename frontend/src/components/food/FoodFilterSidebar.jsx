import React from 'react';
import { Filter, RotateCcw, Flame, Check, Sparkles } from 'lucide-react';
import { VegBadge } from '../common/Badge';

const FoodFilterSidebar = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  isVegOnly,
  onToggleVeg,
  isSpicyOnly,
  onToggleSpicy,
  sortBy,
  onSortChange,
  maxPrice,
  onPriceChange,
  onResetFilters
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-orange-600" />
          <h3 className="font-bold text-slate-800 text-sm">Filters & Sort</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Dietary Preference Quick Toggles */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dietary</h4>
        
        {/* Pure Veg Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <VegBadge isVeg={true} />
            <span className="text-xs font-semibold text-slate-700">Veg Only</span>
          </div>
          <input
            type="checkbox"
            checked={isVegOnly}
            onChange={(e) => onToggleVeg(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </label>

        {/* Spicy Toggle */}
        <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-xs font-semibold text-slate-700">Spicy Picks</span>
          </div>
          <input
            type="checkbox"
            checked={isSpicyOnly}
            onChange={(e) => onToggleSpicy(e.target.checked)}
            className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
          />
        </label>
      </div>

      {/* Sort Strategy Dropdown */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="newest">Featured & Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Max Price Range Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Budget</h4>
          <span className="text-xs font-bold text-orange-600">₹{maxPrice}</span>
        </div>
        <input
          type="range"
          min="100"
          max="800"
          step="50"
          value={maxPrice}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>₹100</span>
          <span>₹800+</span>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
              selectedCategory === 'all'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Delicacies</span>
            {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate">{cat.name}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  cat.itemCount !== undefined && (
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded-md">
                      {cat.itemCount}
                    </span>
                  )
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FoodFilterSidebar;
