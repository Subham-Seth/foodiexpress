import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  Clock,
  Flame,
  Award,
  ChevronRight,
  Tag,
  Star,
  Quote
} from 'lucide-react';
import FoodCard from '../components/food/FoodCard';
import { foodAPI, categoryAPI } from '../services/api';
import { PageLoader } from '../components/common/Loader';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [topRatedFoods, setTopRatedFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catsRes, foodsRes] = await Promise.all([
          categoryAPI.getAll(),
          foodAPI.getFeatured()
        ]);

        if (catsRes.data.success) {
          setCategories(catsRes.data.data);
        }
        if (foodsRes.data.success) {
          setFeaturedFoods(foodsRes.data.data.featured || []);
          setTopRatedFoods(foodsRes.data.data.topRated || []);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <PageLoader message="Preparing delicious menu..." />;
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 to-white pt-8 pb-14 sm:py-16 rounded-3xl border border-orange-100/50 mt-4 mx-4 sm:mx-6 lg:mx-8">
        {/* Decorative background blurs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-extrabold tracking-wide uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
                Fresh, Fast, and Affordable
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Delicious Food <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                  Delivered to Your Door
                </span>
              </h1>

              {/* Secondary Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Craving gourmet stone-baked pizzas, aromatic dum biryanis, or smash burgers?
                FoodieXpress delivers restaurant-quality meals hot and fresh in under 30 minutes.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/menu?isFeatured=true"
                  className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                  <span>Chef's Specials</span>
                </Link>
              </div>

              {/* Live Mini Stats */}
              <div className="pt-6 border-t border-orange-200/40 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">30 Mins</h4>
                  <p className="text-xs text-slate-500 font-medium">Avg Delivery Time</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">4.9 ★</h4>
                  <p className="text-xs text-slate-500 font-medium">Customer Rating</p>
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">100%</h4>
                  <p className="text-xs text-slate-500 font-medium">Fresh Ingredients</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Composition */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Main Hero Dish Card */}
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80"
                  alt="Delicious Food"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl ring-8 ring-white"
                />

                {/* Floating promo badge */}
                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                    %
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase">Special Discount</p>
                    <p className="text-xs font-black text-slate-800">Use code: FOODIE10</p>
                  </div>
                </div>

                {/* Floating delivery badge */}
                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-600" />
                  <span className="text-xs font-bold text-slate-800">Free Delivery &gt; ₹499</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Category Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Our Categories
            </h2>
            <p className="text-sm text-slate-500 mt-1">Hand-crafted recipes for every craving</p>
          </div>
          <Link
            to="/menu"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/menu?category=${cat.slug}`}
              className="group bg-white p-3.5 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-3 bg-slate-100 ring-2 ring-transparent group-hover:ring-orange-500/30 transition-all">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                {cat.name}
              </h4>
              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {cat.itemCount || 0} Dishes
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Chef's Picks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 fill-orange-500" /> Trending Now
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Chef's Signature Specials
            </h2>
          </div>
          <Link
            to="/menu?isFeatured=true"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>See More</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFoods.slice(0, 4).map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      </section>

      {/* Promotional Discount Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-orange-500/20">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" /> Weekend Super Saver
            </span>
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Get Up to 20% OFF on Your First Order!
            </h3>
            <p className="text-sm sm:text-base text-orange-100">
              Use promo code <span className="font-mono font-bold bg-white text-orange-600 px-2 py-0.5 rounded">FOODIE10</span> during checkout to unlock instant discounts.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-transform hover:scale-105"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top-Rated Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Customer Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Top Rated by Foodies
            </h2>
          </div>
          <Link
            to="/menu?sortBy=rating"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRatedFoods.slice(0, 4).map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      </section>

      {/* Why Choose FoodieXpress Feature Grid */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Our Promise</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Why Choose FoodieXpress?</h2>
            <p className="text-sm text-slate-400">
              We combine artisan culinary excellence with blazing fast doorstep delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white">Superfast Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hot meals delivered in under 30 minutes with our smart rider routing network.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white">Fresh & Organic</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                100% farm-fresh ingredients, freshly prepared in hygienic kitchens upon order.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white">Live Order Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step transparency from kitchen prep to your doorstep.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white">Secure Payments</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamless Cash on Delivery, Cards, and instant UPI checkout options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Loved by 10,000+ Happy Foodies
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <Quote className="w-8 h-8 text-orange-200" />
            <p className="text-sm text-slate-600 leading-relaxed">
              "The Hyderabadi Dum Biryani and Margherita Pizza arrived super hot! The real-time tracking is super convenient."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Pooja S"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h5 className="font-bold text-xs text-slate-800">Pooja Sharma</h5>
                <p className="text-[10px] text-slate-400">Verified Customer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <Quote className="w-8 h-8 text-orange-200" />
            <p className="text-sm text-slate-600 leading-relaxed">
              "The double smash burgers are genuinely the best in town. Fast checkout and friendly delivery heroes."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Rahul M"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h5 className="font-bold text-xs text-slate-800">Rahul Menon</h5>
                <p className="text-[10px] text-slate-400">Food Blogger</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <Quote className="w-8 h-8 text-orange-200" />
            <p className="text-sm text-slate-600 leading-relaxed">
              "Affordable prices, generous portions, and great discounts. FoodieXpress is my go-to dinner app!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt="Ananya K"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h5 className="font-bold text-xs text-slate-800">Ananya Kapoor</h5>
                <p className="text-[10px] text-slate-400">CSE Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
