import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../../components/common/Loader';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Checking administrator credentials..." />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login?redirect=admin" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row bg-slate-100/70">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
