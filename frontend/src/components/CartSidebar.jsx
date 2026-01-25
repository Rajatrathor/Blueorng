import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery, useRemoveFromCartMutation, useUpdateCartItemMutation } from '../features/cart/cartApi';
import { closeCart } from '../features/ui/uiSlice';
import { X, Trash2 } from 'lucide-react';

const CartSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartOpen = useSelector((state) => state.ui.cartOpen);
  const { data: cart, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated, refetchOnMountOrArgChange: true });
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const subtotal = cart?.items?.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0) || 0;

  const handleClose = () => dispatch(closeCart());
  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  const handleViewCart = () => {
    dispatch(closeCart());
    navigate('/cart');
  };

  if (!user || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') return null;
  return (
    <div className={`fixed inset-0 z-[60] ${cartOpen ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold uppercase tracking-widest">Your Cart</h2>
          <button className="text-gray-600 hover:text-gray-900" onClick={handleClose} aria-label="Close cart">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6">Loading...</div>
          ) : !cart?.items?.length ? (
            <div className="p-6">
              <p className="font-medium">Your cart is empty</p>
              <button onClick={handleClose} className="mt-4 px-4 py-2 border border-gray-300">Continue Shopping</button>
            </div>
          ) : (
            <div className="divide-y">
              {cart.items.map((item) => (
                <div key={item.id} className="flex px-6 py-4">
                  <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                    {item.product.images?.[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium uppercase">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Size: {item.size || 'N/A'}</p>
                      </div>
                      <p className="font-medium">₹{Number(item.product.price).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity - 1 })}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItem({ itemId: item.id, quantity: item.quantity + 1 })}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-6 py-4">
          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCheckout}
              className="flex-1 bg-black text-white py-3 uppercase font-bold tracking-widest hover:bg-gray-800 transition"
            >
              Checkout
            </button>
            <button
              onClick={handleViewCart}
              className="px-4 py-3 border border-gray-300"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
