import React from 'react';
import { useGetOrdersQuery } from '../../features/orders/ordersApi';
import { useGetProductsQuery } from '../../features/products/productsApi';
import { useGetUsersQuery } from '../../features/users/usersApi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useGetOrdersQuery();
  const { data: products, isLoading: productsLoading, isError: productsError } = useGetProductsQuery({});
  const { data: users, isLoading: usersLoading, isError: usersError } = useGetUsersQuery(undefined, { refetchOnMountOrArgChange: true });
  const { user } = useSelector((state) => state.auth);

  if (ordersError || productsError || usersError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading dashboard data. Please try refreshing the page.
      </div>
    );
  }

  if (ordersLoading || productsLoading || usersLoading) return <div className="text-center py-8">Loading dashboard...</div>;

  const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.totalAmount), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalProducts = products?.length || 0;
  const totalUsers = users?.length || 0;
  const adminCount = Array.isArray(users) ? users.filter(u => u.role === 'ADMIN').length : 0;
  const superAdminCount = Array.isArray(users) ? users.filter(u => u.role === 'SUPER_ADMIN').length : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Products</h3>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
        {user?.role === 'SUPER_ADMIN' ? (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Users</h3>
            <p className="text-3xl font-bold">{totalUsers}</p>
            <div className="mt-2 text-sm text-gray-600">Admins: {adminCount} • Super Admins: {superAdminCount}</div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Quick Actions</h3>
            <div className="flex gap-3">
              <Link to="/admin/products/new" className="px-3 py-2 bg-black text-white rounded">Add Product</Link>
              <Link to="/admin/categories" className="px-3 py-2 bg-black text-white rounded">Manage Categories</Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders?.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.user?.name || order.user?.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">₹{Number(order.totalAmount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
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

export default Dashboard;
