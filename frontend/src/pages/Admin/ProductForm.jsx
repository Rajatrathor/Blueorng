import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProductMutation, useUpdateProductMutation, useGetProductByIdQuery } from '../../features/products/productsApi';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: product, isLoading: productLoading } = useGetProductByIdQuery(id, { skip: !isEditMode });
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    color: '',
    sizes: [],
    images: [''],
    active: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        color: product.color || '',
        sizes: product.sizes || [],
        images: product.images.length ? product.images : [''],
        active: typeof product.active === 'boolean' ? product.active : true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, sizes: [...prev.sizes, value] };
      } else {
        return { ...prev, sizes: prev.sizes.filter(s => s !== value) };
      }
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId),
      images: formData.images.filter(img => img.trim() !== '')
    };

    try {
      if (isEditMode) {
        await updateProduct({ id, ...data }).unwrap();
        alert('Product updated successfully');
      } else {
        await createProduct(data).unwrap();
        alert('Product created successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  if (isEditMode && productLoading) return <div>Loading...</div>;
  if (categoriesLoading) return <div>Loading...</div>;

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
            >
              <option value="">Select Category</option>
              {categories?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
          <div className="flex flex-wrap gap-4">
            {availableSizes.map(size => (
              <label key={size} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={size}
                  checked={formData.sizes.includes(size)}
                  onChange={handleSizeChange}
                  className="rounded text-black focus:ring-black"
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images (URLs)</label>
          {formData.images.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://..."
                className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
              />
            </div>
          ))}
          <button type="button" onClick={addImageField} className="text-sm text-blue-600 hover:underline">
            + Add another image URL
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="active"
            type="checkbox"
            checked={formData.active}
            onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
            className="rounded text-black focus:ring-black"
          />
          <label htmlFor="active" className="text-sm font-medium text-gray-700">Active</label>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="w-full bg-black text-white py-3 rounded-md font-bold uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isEditMode ? (isUpdating ? 'Updating...' : 'Update Product') : (isCreating ? 'Creating...' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
