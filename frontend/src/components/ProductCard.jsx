import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-4 relative">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-105 transition duration-500">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            'No Image'
          )}
        </div>
      </div>
      <h3 className="text-sm font-medium uppercase">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-1">₹{Number(product.price).toFixed(2)}</p>
    </Link>
  );
};

export default ProductCard;
