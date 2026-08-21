import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, UtensilsCrossed, ArrowUpDown } from 'lucide-react';
import FoodCard from '../components/food/FoodCard';
import FoodFilterSidebar from '../components/food/FoodFilterSidebar';
import { FoodCardSkeleton } from '../components/common/Loader';
import { foodAPI, categoryAPI } from '../services/api';

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state from URL query
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const isVeg = searchParams.get('isVeg') === 'true';
  const isSpicy = searchParams.get('isSpicy') === 'true';
  const isFeatured = searchParams.get('isFeatured') === 'true';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const maxPrice = Number(searchParams.get('maxPrice')) || 800;
  const page = Number(searchParams.get('page')) || 1;

  const [searchInput, setSearchInput] = useState(search);

  // Fetch Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch Foods on filter params change
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sortBy
        };

        if (search) params.search = search;
        if (category && category !== 'all') params.category = category;
        if (isVeg) params.isVeg = true;
        if (isSpicy) params.isSpicy = true;
        if (isFeatured) params.isFeatured = true;
        if (maxPrice < 800) params.maxPrice = maxPrice;

        const res = await foodAPI.getAll(params);
        if (res.data.success) {
          setFoods(res.data.data);
          setTotalPages(res.data.pages);
          setTotalCount(res.data.total);
        }
      } catch (err) {
        console.error('Failed to fetch menu dishes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [search, category, isVeg, isSpicy, isFeatured, sortBy, maxPrice, page]);

  // Sync state helpers
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === '' || value === 'all' || value === false || (key === 'maxPrice' && value >= 800)) {
      newParams.delete(key);
    } else {
      newParams.set(key, value.toString());
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateParam('search', '');
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Explore Our Culinary Delights
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              FoodieXpress Menu
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {totalCount} delicious items freshly crafted in our kitchen
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Search burgers, pizzas, biryani..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden flex items-center justify-between">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-orange-600" />
          <span>{mobileFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
        </button>

        <span className="text-xs text-slate-500 font-semibold">{totalCount} items found</span>
      </div>

      {/* Content Layout (Sidebar + Food Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filter Sidebar Desktop & Mobile */}
        <div className={`lg:col-span-3 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <FoodFilterSidebar
            categories={categories}
            selectedCategory={category}
            onSelectCategory={(catSlug) => updateParam('category', catSlug)}
            isVegOnly={isVeg}
            onToggleVeg={(val) => updateParam('isVeg', val)}
            isSpicyOnly={isSpicy}
            onToggleSpicy={(val) => updateParam('isSpicy', val)}
            sortBy={sortBy}
            onSortChange={(val) => updateParam('sortBy', val)}
            maxPrice={maxPrice}
            onPriceChange={(val) => updateParam('maxPrice', val)}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Dishes Grid */}
        <div className="lg:col-span-9 space-y-6">
          {/* Active Filter Chips */}
          {(category !== 'all' || isVeg || isSpicy || isFeatured || search || maxPrice < 800) && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs text-slate-400 font-bold">Active:</span>
              {category !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold">
                  {categories.find((c) => c.slug === category)?.name || category}
                  <button onClick={() => updateParam('category', 'all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {isVeg && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  Veg Only
                  <button onClick={() => updateParam('isVeg', false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {isSpicy && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold">
                  Spicy
                  <button onClick={() => updateParam('isSpicy', false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-200 text-slate-800 rounded-full text-xs font-bold">
                  Search: "{search}"
                  <button onClick={handleClearSearch}><X className="w-3 h-3" /></button>
                </span>
              )}
              {maxPrice < 800 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                  Under ₹{maxPrice}
                  <button onClick={() => updateParam('maxPrice', 800)}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Grid View */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <FoodCardSkeleton key={i} />
              ))}
            </div>
          ) : foods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No dishes match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters to discover more tasty options.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => updateParam('page', page - 1)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <span className="text-xs font-bold text-slate-700 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => updateParam('page', page + 1)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
