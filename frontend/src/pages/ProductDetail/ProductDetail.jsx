import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../features/products/productsApi';
import { useAddToCartMutation } from '../../features/cart/cartApi';
import { useSelector, useDispatch } from 'react-redux';
import { openCart } from '../../features/ui/uiSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const [selectedSize, setSelectedSize] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      alert('Admins cannot add items to cart');
      return;
    }
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }
    try {
      await addToCart({ productId: product.id, quantity: 1, size: selectedSize }).unwrap();
      dispatch(openCart());
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Images */}
      <div>
        <div className="aspect-[3/4] bg-gray-100 w-full flex items-center justify-center text-gray-400">
          {product.images?.length ? (
            <img
              src={product.images[activeImageIndex]}
              alt={`${product.name} ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            'No Image'
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`aspect-square bg-gray-100 overflow-hidden border ${activeImageIndex === idx ? 'border-black' : 'border-transparent'}`}
              >
                <img src={img} alt={`${product.name} thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">{product.name}</h1>
        <p className="text-xl text-gray-500 mb-6">₹{Number(product.price).toFixed(2)}</p>

        <div className="mb-8">
          <p className="text-sm uppercase font-bold mb-3">Description</p>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {product.sizes?.length > 0 && (
          <div className="mb-8">
            <p className="text-sm uppercase font-bold mb-3">Size</p>
            <div className="flex space-x-4">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center border ${selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'
                    } transition`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isAdding || (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'))}
          className="w-full bg-black text-white py-4 uppercase font-bold tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isAdding ? 'Adding...' : (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) ? 'Cart disabled for admin' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
