import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  UtensilsCrossed,
  Users,
  TrendingUp,
  ArrowRight,
  RotateCw,
  Eye
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import { OrderStatusBadge } from '../../components/common/Badge';
import { PageLoader } from '../../components/common/Loader';
import { adminAPI, orderAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminDashboardPage = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await adminAPI.getDashboardStats();
      if (res.data.success) {
        setStats(res.data.data);
        if (isManual) showToast('Dashboard metrics refreshed', 'success');
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await orderAPI.updateStatus(orderId, { status: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  if (loading) {
    return <PageLoader message="Loading admin analytics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Restaurant Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Admin Analytics Dashboard
          </h1>
        </div>

        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Updating...' : 'Refresh Metrics'}</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Sales"
          value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
          subtitle="Non-cancelled revenue"
          icon={DollarSign}
          color="emerald"
        />

        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          subtitle={`${stats?.deliveredOrders || 0} Delivered`}
          icon={ShoppingBag}
          color="orange"
        />

        <StatCard
          title="Active Deliveries"
          value={stats?.activeOrders || 0}
          subtitle="In kitchen or transit"
          icon={Clock}
          color="purple"
        />

        <StatCard
          title="Menu Items"
          value={stats?.totalFoods || 0}
          subtitle={`${stats?.totalCategories || 0} Categories`}
          icon={UtensilsCrossed}
          color="blue"
        />
      </div>

      {/* Two Column Section: Recent Orders & Top Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Recent Customer Orders</h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-bold uppercase border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {order.user?.name || order.deliveryAddress?.fullName || 'Customer'}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-medium">
                      {order.orderItems?.length || 0} dish(es)
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      ₹{order.totalPrice}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="p-1 text-[11px] font-bold rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        to={`/order/${order._id}`}
                        className="p-1.5 text-slate-400 hover:text-purple-600 inline-block"
                        title="View Live Tracker"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Top Selling Dishes</h3>
          </div>

          <div className="space-y-3">
            {stats?.topSellingFoods && stats.topSellingFoods.length > 0 ? (
              stats.topSellingFoods.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.totalSold} portions sold</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 shrink-0">
                    ₹{item.revenue}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No order sales aggregated yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
