import React from 'react';
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartItemMutation } from '../../features/cart/cartApi';
import { useCreateOrderMutation } from '../../features/orders/ordersApi';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { data: cart, isLoading } = useGetCartQuery(undefined, { refetchOnMountOrArgChange: true });
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();
  const navigate = useNavigate();

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  const subtotal = cart?.items?.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;

  const handleCheckout = async () => {
    navigate('/checkout');
  };

  if (!cart?.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.items.map((item) => (
            <div key={item.id} className="flex border-b border-gray-200 pb-6">
              <div className="w-24 h-32 bg-gray-100 flex-shrink-0">
                {item.product.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
              </div>
              <div className="ml-6 flex-grow">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium uppercase">{item.product.name}</h3>
                  <p className="font-medium">₹{Number(item.product.price).toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500 mb-4">Size: {item.size || 'N/A'}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity - 1 })}
                      className="px-3 py-1 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity + 1 })}
                      className="px-3 py-1 hover:bg-gray-100"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-6 h-fit">
          <h2 className="text-lg font-bold uppercase mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-6">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-6 border-t border-gray-200 pt-4">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isOrdering}
            className="w-full bg-black text-white py-4 uppercase font-bold tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isOrdering ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
