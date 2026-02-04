import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/products/productsApi';
import { useGetCategoriesQuery } from '../../features/categories/categoriesApi';
import ProductCard from '../../components/ProductCard';

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { data: categories } = useGetCategoriesQuery();
  const { data: products, isLoading } = useGetProductsQuery({ active: true, category: selectedCategory || undefined });


  const heroImages = [


    // High-end streetwear editorial
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",

    // Moody fashion with shadows
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80",

    // Minimal dark aesthetic
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=2000&q=80",

  ];





  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;
    return products.filter((p) => {
      const price = Number(p.price);
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;
      return true;
    });
  }, [products, minPrice, maxPrice]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div>
      <div className="relative h-[60vh] text-white">
        <div className="absolute inset-0">
          <img src={heroImages[activeIndex]} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 uppercase">New Collection</h1>
            <p className="text-lg md:text-xl mb-8 font-light tracking-wide">Discover styles curated for you</p>
            <Link to="/category/all" className="bg-white text-black px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-gray-200 transition">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 w-6 ${activeIndex === i ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gray-50 border border-gray-200 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
              >
                <option value="">All</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="500"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
              />
            </div>
            <div className="mt-6 md:mt-0">
              <Link to={`/category/${selectedCategory || 'shop-all'}`} className="inline-block bg-black text-white px-4 py-2 rounded-md">
                Browse Category
              </Link>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Top Picks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts?.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
