import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Flame,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Star,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Send
} from 'lucide-react';
import { VegBadge } from '../components/common/Badge';
import StarRating from '../components/common/StarRating';
import FoodCard from '../components/food/FoodCard';
import { PageLoader } from '../components/common/Loader';
import { foodAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const FoodDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await foodAPI.getById(id);
        if (res.data.success) {
          setFood(res.data.data);
          setReviews(res.data.data.reviews || []);
          setRelatedFoods(res.data.data.relatedFoods || []);
        }
      } catch (err) {
        console.error('Failed to load food details', err);
        showToast('Food item not found', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (food) {
      addToCart(food, quantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to write a review', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please enter a review comment', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await foodAPI.addReview(id, {
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.data.success) {
        showToast('Review submitted successfully!', 'success');
        setReviewComment('');
        // Reload details to refresh reviews and rating
        const refreshed = await foodAPI.getById(id);
        if (refreshed.data.success) {
          setFood(refreshed.data.data);
          setReviews(refreshed.data.data.reviews || []);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <PageLoader message="Fetching dish specifications..." />;
  }

  if (!food) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800">Dish not found</h3>
        <Link to="/menu" className="inline-block px-6 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl">
          Return to Menu
        </Link>
      </div>
    );
  }

  const effectivePrice = food.discountedPrice > 0 ? food.discountedPrice : food.price;
  const totalPrice = effectivePrice * quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <Link to="/menu" className="hover:text-orange-600">Menu</Link>
        <span>/</span>
        <span className="text-slate-800 font-bold truncate max-w-xs">{food.name}</span>
      </div>

      {/* Main Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Food Image with Badges */}
        <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />

          {/* Floating Veg and Spicy badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
              <VegBadge isVeg={food.isVeg} />
              <span className="text-xs font-bold text-slate-800">
                {food.isVeg ? 'Vegetarian' : 'Non-Veg'}
              </span>
            </div>
            {food.isSpicy && (
              <div className="bg-rose-600 text-white px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-1 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-white" /> Spicy
              </div>
            )}
          </div>

          {food.discountedPrice > 0 && food.discountedPrice < food.price && (
            <div className="absolute top-4 right-4 bg-orange-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg">
              {Math.round(((food.price - food.discountedPrice) / food.price) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Right: Food Details & Add to Cart Controller */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Category tag */}
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-md">
              {food.category?.name || food.categoryName || 'Chef Choice'}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
              {food.name}
            </h1>

            {/* Ratings & Reviews summary */}
            <div className="flex items-center gap-3 mt-3">
              <StarRating rating={food.rating || 4.8} size="md" showValue={true} />
              <span className="text-xs text-slate-400">
                ({food.numReviews || reviews.length} customer reviews)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {food.description}
          </p>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Prep Time</p>
                <p className="text-xs font-bold text-slate-800">{food.prepTimeMinutes || 20} mins</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
              <Flame className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Calories</p>
                <p className="text-xs font-bold text-slate-800">{food.calories || 350} kcal</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Quality</p>
                <p className="text-xs font-bold text-slate-800">100% Fresh</p>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {food.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price & Add to Cart Block */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{effectivePrice}
              </span>
              {food.discountedPrice > 0 && food.discountedPrice < food.price && (
                <span className="text-base text-slate-400 line-through">
                  ₹{food.price}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium ml-auto">
                Total: <span className="font-bold text-slate-900">₹{totalPrice}</span>
              </span>
            </div>

            {/* Quantity Controller & Add Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl shadow-xs transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/30 transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart (₹{totalPrice})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Customer Reviews</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real feedback from verified foodies</p>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-xl font-black text-slate-900">{Number(food.rating || 4.8).toFixed(1)}</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
          <h4 className="text-sm font-bold text-slate-800">
            {user ? 'Leave Your Review & Rating' : 'Sign in to write a review'}
          </h4>

          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Your Rating
                </label>
                <StarRating
                  rating={reviewRating}
                  interactive={true}
                  size="lg"
                  onRatingChange={(newRating) => setReviewRating(newRating)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Your Review
                </label>
                <textarea
                  rows="3"
                  placeholder="Share your thoughts about flavor, portion size, and delivery..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-2">
              <p className="text-xs text-slate-500">
                You must be signed in to submit reviews and feedback for our dishes.
              </p>
              <Link
                to="/login"
                className="inline-block px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Sign In Now
              </Link>
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{rev.userName}</h5>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-11">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">
              No reviews yet for this dish. Be the first to try and review it!
            </p>
          )}
        </div>
      </div>

      {/* Related Dishes Carousel */}
      {relatedFoods.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">You Might Also Like</h3>
              <p className="text-xs text-slate-500 mt-0.5">Dishes from the same category</p>
            </div>
            <Link to="/menu" className="text-xs font-bold text-orange-600 hover:underline">
              View Menu
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedFoods.map((foodItem) => (
              <FoodCard key={foodItem._id} food={foodItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetailPage;
