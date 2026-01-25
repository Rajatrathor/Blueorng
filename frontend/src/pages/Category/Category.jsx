import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/products/productsApi';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi';
import ProductCard from '../../components/ProductCard';

const Category = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  // If slug is 'all', we don't filter. If 'new-arrivals', maybe sort.
  // Real implementation would map slug to category ID or pass slug to backend if supported.
  // For now, let's just fetch all or filter client side if backend doesn't support slug lookup yet.
  // Backend supports `?category=Name`.

  const categoryParam = slug === 'all' || slug === 'shop-all' || slug === 'new-arrivals' ? undefined : slug;
  const initialSort = slug === 'new-arrivals' ? 'newest' : undefined;
  const [sort, setSort] = useState(initialSort || 'featured');
  const [size, setSize] = useState('');
  const [availability, setAvailability] = useState('');
  const [color, setColor] = useState('');

  const { data: categories } = useGetCategoriesQuery();
  const { data: products, isLoading } = useGetProductsQuery({
    category: categoryParam,
    sort,
    active: true,
    ...(size ? { size } : {}),
    ...(availability ? { availability } : {}),
    ...(color ? { color } : {}),
  });

  const availableColors = useMemo(() => {
    const set = new Set();
    products?.forEach(p => { if (p.color) set.add(p.color); });
    return Array.from(set);
  }, [products]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">
        {slug === 'all' || slug === 'shop-all' ? 'Shop All' : (slug === 'new-arrivals' ? 'New Arrivals' : slug)}
      </h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => navigate('/category/shop-all')}
          className={`px-3 py-1 rounded border ${(!categoryParam && slug !== 'new-arrivals') ? 'bg-black text-white' : 'border-gray-300'}`}
        >
          All
        </button>
        {categories?.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/category/${c.name}`)}
            className={`px-3 py-1 rounded border ${categoryParam === c.name ? 'bg-black text-white' : 'border-gray-300'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 border-y py-4">
        <div className="text-sm font-semibold uppercase">Filter:</div>
        <div>
          <label className="text-xs text-gray-500 mr-2">Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="border px-2 py-1 text-sm">
            <option value="">All</option>
            {['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mr-2">Availability</label>
          <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="border px-2 py-1 text-sm">
            <option value="">All</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mr-2">Type</label>
          <select
            value={categoryParam || ''}
            onChange={(e) => navigate(`/category/${e.target.value || 'shop-all'}`)}
            className="border px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {categories?.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mr-2">Color</label>
          <select value={color} onChange={(e) => setColor(e.target.value)} className="border px-2 py-1 text-sm">
            <option value="">All</option>
            {availableColors.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>
        <div className="ml-auto">
          <label className="text-xs text-gray-500 mr-2">Sort by</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border px-2 py-1 text-sm">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {products?.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
