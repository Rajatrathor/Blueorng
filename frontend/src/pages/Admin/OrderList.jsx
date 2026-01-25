import React from 'react';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../../features/orders/ordersApi';
import { Eye } from 'lucide-react';

const OrderList = () => {
  const { data: orders, isLoading } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus({ id, status: newStatus }).unwrap();
      // No alert needed, UI updates automatically via RTK Query invalidation
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders?.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 text-sm font-medium">#{order.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{order.user?.name}</div>
                  <div className="text-xs text-gray-400">{order.user?.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">₹{Number(order.totalAmount).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div>{order.fullName}</div>
                  <div className="text-xs text-gray-400">
                    {order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ''}
                  </div>
                  <div className="text-xs text-gray-400">
                    {order.city}, {order.state} {order.postalCode} • {order.country}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.paymentMethod || '—'}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-sm rounded-full px-3 py-1 font-medium border-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'DELIVERED' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                      }`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {/* View Details could be a modal or separate page, keeping it simple for now */}
                  <button className="text-gray-500 hover:text-black">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
