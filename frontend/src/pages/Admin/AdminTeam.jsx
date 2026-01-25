import React, { useState } from 'react';
import { useGetUsersQuery, useCreateAdminMutation, useDeleteUserMutation } from '../../features/users/usersApi';
import { Trash2, Plus, X } from 'lucide-react';

const AdminTeam = () => {
  const { data: users, isLoading } = useGetUsersQuery();
  const [createAdmin] = useCreateAdminMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Filter admins and super admins
  const admins = users?.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN') || [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this admin?')) {
      try {
        await deleteUser(id).unwrap();
        alert('Admin removed');
      } catch (err) {
        console.error(err);
        alert('Failed to remove admin');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdmin(formData).unwrap();
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '' });
      alert('Admin added successfully');
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || 'Failed to add admin');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition"
        >
          <Plus size={20} />
          <span>Add Admin</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-6 py-4 text-sm font-medium">{admin.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{admin.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    admin.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {admin.role !== 'SUPER_ADMIN' && (
                    <button 
                      onClick={() => handleDelete(admin.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">Add New Admin</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-black text-white py-3 font-bold uppercase tracking-wide hover:bg-gray-800 transition mt-4"
              >
                Create Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
