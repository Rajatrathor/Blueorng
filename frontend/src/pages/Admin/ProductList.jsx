import React from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from '../../features/products/productsApi';
import { Edit, Trash2, Plus } from 'lucide-react';

const ProductList = () => {
  const { data: products, isLoading } = useGetProductsQuery({});
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        alert('Product deleted');
      } catch (err) {
        console.error(err);
        alert('Failed to delete product');
      }
    }
  };

  const toggleActive = async (product) => {
    try {
      await updateProduct({ id: product.id, active: !product.active }).unwrap();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link to="/admin/products/new" className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition">
          <Plus size={20} />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <div className="w-12 h-16 bg-gray-100">
                    {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">₹{Number(product.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(product)}
                    className={`px-3 py-1 rounded text-xs font-bold ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {product.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <Link to={`/product/${product.id}`} className="text-gray-700 hover:text-black">
                      View
                    </Link>
                    <Link to={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
