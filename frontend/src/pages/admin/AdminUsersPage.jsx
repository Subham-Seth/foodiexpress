import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, User, Trash2, RotateCw } from 'lucide-react';
import { PageLoader } from '../../components/common/Loader';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter !== 'all') params.role = roleFilter;

      const res = await adminAPI.getUsers(params);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleToggleRole = async (targetUser) => {
    if (targetUser._id === currentUser._id) {
      showToast('Cannot modify your own admin role', 'error');
      return;
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await adminAPI.updateUserRole(targetUser._id, { role: newRole });
      if (res.data.success) {
        showToast(res.data.message || 'User role updated', 'success');
        fetchUsers();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser._id === currentUser._id) {
      showToast('Cannot delete your own admin account', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user ${targetUser.name}?`)) return;

    try {
      const res = await adminAPI.deleteUser(targetUser._id);
      if (res.data.success) {
        showToast('User deleted successfully', 'success');
        fetchUsers();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  if (loading) {
    return <PageLoader message="Loading user directory..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Access Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            User Accounts Directory ({users.length})
          </h1>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Customers (user)</option>
            <option value="admin">Administrators (admin)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/20"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {u.phone || 'Not specified'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleRole(u)}
                      disabled={u._id === currentUser._id}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                      title="Click to toggle role"
                    >
                      {u.role === 'admin' ? 'Administrator' : 'Customer'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u._id !== currentUser._id && (
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
