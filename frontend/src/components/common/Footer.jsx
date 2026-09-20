import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Superfast 30-Min Delivery</h4>
                <p className="text-xs text-slate-400">Fresh and piping hot to your doorstep</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">100% Quality Guaranteed</h4>
                <p className="text-xs text-slate-400">Artisan chefs & fresh natural ingredients</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Safe & Secure Payments</h4>
                <p className="text-xs text-slate-400">Cash on Delivery & Secure Online Pay</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Foodie<span className="text-orange-500">Xpress</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              "Delicious Food Delivered to Your Door"
            </p>
            <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">
              Fresh, Fast, and Affordable
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Kitchen Live & Accepting Orders
              </span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-orange-400 transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-orange-400 transition-colors">Explore Full Menu</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400 transition-colors">Contact & Support</Link></li>
              <li><Link to="/orders" className="hover:text-orange-400 transition-colors">Track Orders</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Popular Food</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/menu?category=artisan-pizzas" className="hover:text-orange-400 transition-colors">Artisan Pizzas</Link></li>
              <li><Link to="/menu?category=gourmet-burgers" className="hover:text-orange-400 transition-colors">Gourmet Smash Burgers</Link></li>
              <li><Link to="/menu?category=biryani-kebabs" className="hover:text-orange-400 transition-colors">Hyderabadi Dum Biryani</Link></li>
              <li><Link to="/menu?category=desserts-shakes" className="hover:text-orange-400 transition-colors">Lava Cakes & Shakes</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wide uppercase">Store Location</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>124 Culinary Boulevard, Gourmet Square, Bengaluru - 560001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@foodiexpress.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Mon - Sun: 10:00 AM - 11:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FoodieXpress Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
