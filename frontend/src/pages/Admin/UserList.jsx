import React from 'react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../features/users/usersApi';
import { Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const UserList = () => {
  const { data: users, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const { user: currentUser } = useSelector((state) => state.auth);

  // Filter only regular users (customers)
  const customers = users?.filter(u => u.role === 'USER') || [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUser(id).unwrap();
        alert('User deleted');
      } catch (err) {
        console.error(err);
        alert('Failed to delete user');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
              {currentUser.role === 'SUPER_ADMIN' && (
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 text-sm font-medium">{customer.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
                {currentUser.role === 'SUPER_ADMIN' && (
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={currentUser.role === 'SUPER_ADMIN' ? 4 : 3} className="px-6 py-8 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
