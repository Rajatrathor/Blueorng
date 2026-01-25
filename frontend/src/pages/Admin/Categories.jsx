import React, { useState } from 'react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../features/categories/categoriesApi';
import { Plus, Trash2 } from 'lucide-react';

const Categories = () => {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [name, setName] = useState('');
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      alert('Category deleted');
    } catch (e) {
      alert('Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory({ name }).unwrap();
      setName('');
      alert('Category created');
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || 'Failed to create category');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories?.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4 text-sm font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(cat.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {(!categories || categories.length === 0) && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Add New Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition"
            >
              <Plus size={20} />
              <span>{isCreating ? 'Creating...' : 'Create Category'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Categories;
