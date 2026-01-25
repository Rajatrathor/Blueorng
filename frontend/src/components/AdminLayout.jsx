import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { api } from '../app/api';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Users, Shield, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="h-12 flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-900">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold">Admin</span>
          <div className="flex items-center gap-3">
            <Link to="/category/shop-all" className="text-gray-600 hover:text-black text-sm">View Store</Link>
            <button onClick={handleLogout} className="text-gray-500">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`md:w-64 bg-black text-white flex flex-col md:static fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tighter">ADMIN</h1>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-900 hover:text-white rounded-lg transition">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <div className="px-4 pt-4 text-xs uppercase text-gray-400">Storefront</div>
          <Link to="/category/new-arrivals" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-900 hover:text-white rounded-lg transition">
            <ShoppingBag size={20} />
            <span>New Arrivals</span>
          </Link>
          <Link to="/category/shop-all" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-900 hover:text-white rounded-lg transition">
            <Package size={20} />
            <span>Shop All</span>
          </Link>
          <Link to="/admin/products" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-900 hover:text-white rounded-lg transition">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link to="/admin/categories" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-900 hover:text-white rounded-lg transition">
            <Package size={20} />
            <span>Categories</span>
          </Link>
          <Link to="/admin/contacts" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-900 hover:text-white rounded-lg transition">
            <Package size={20} />
            <span>Contact Queries</span>
          </Link>
          <Link to="/admin/orders" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-900 hover:text-white rounded-lg transition">
            <ShoppingBag size={20} />
            <span>Orders</span>
          </Link>
          <Link to="/admin/users" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-900 hover:text-white rounded-lg transition">
            <Users size={20} />
            <span>Customers</span>
          </Link>
          {user?.role === 'SUPER_ADMIN' && (
            <Link to="/admin/team" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-900 hover:text-white rounded-lg transition">
              <Shield size={20} />
              <span>Team</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white w-full transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto md:pt-0 pt-12">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
