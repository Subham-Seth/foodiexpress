import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  MessageSquare,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';

const AdminSidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      isActive
        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white p-6 shrink-0 md:min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm tracking-tight text-white">
              Foodie<span className="text-purple-400">Admin</span>
            </h3>
            <p className="text-[10px] text-purple-300 font-medium">Control Center</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <NavLink to="/admin" end className={navLinkClass}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin/foods" className={navLinkClass}>
            <UtensilsCrossed className="w-4 h-4" />
            <span>Food Catalog</span>
          </NavLink>

          <NavLink to="/admin/orders" className={navLinkClass}>
            <ShoppingBag className="w-4 h-4" />
            <span>Live Orders</span>
          </NavLink>

          <NavLink to="/admin/users" className={navLinkClass}>
            <Users className="w-4 h-4" />
            <span>Users & Staff</span>
          </NavLink>
        </nav>
      </div>

      {/* Back to Client Store Link */}
      <div className="pt-6 border-t border-slate-800 mt-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to FoodieXpress Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
