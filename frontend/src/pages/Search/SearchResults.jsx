import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/products/productsApi';
import ProductCard from '../../components/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const { data: products, isLoading } = useGetProductsQuery({ search: query, active: true });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{query}"
      </h1>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
