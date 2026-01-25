import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { api } from '../app/api';
import { ShoppingBag, User, LogOut, Search, Menu, X } from 'lucide-react';
import { useGetCartQuery } from '../features/cart/cartApi';
import { openCart, closeCart } from '../features/ui/uiSlice';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Skip query if not authenticated
  const { data: cart } = useGetCartQuery(undefined, { skip: !isAuthenticated, refetchOnMountOrArgChange: true });

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    dispatch(closeCart());
    window.location.href = '/login';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to a search page or filter via URL query params on a generic list page
      // Since we don't have a dedicated search page, let's just go to 'Shop All' with a query param?
      // Or better, let's create a quick SearchResults page or handle it in Category.
      // For now, let's navigate to /category/all but maybe we can add ?search=... logic later.
      // Actually, let's just create a SearchResults page.
      navigate(`/search?q=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter uppercase">
              BluOrng
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/category/new-arrivals" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                New Arrivals
              </Link>
              <Link to="/category/shop-all" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Shop All
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/contact" className="text-gray-500 hover:text-gray-900 font-medium">
              Contact
            </Link>
            {/* Search Icon */}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-500 hover:text-gray-900">
              <Search className="h-6 w-6" />
            </button>

            {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
              <Link to="/admin" className="text-gray-900 font-medium mr-4">
                Admin
              </Link>
            ) : null}
            {user ? (
              <>
                <Link to="/profile" className="text-gray-500 hover:text-gray-900">
                  <User className="h-6 w-6" />
                </Link>
                {(user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') && (
                  <Link
                    to="/cart"
                    className="text-gray-500 hover:text-gray-900 relative"
                  >
                    <ShoppingBag className="h-6 w-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900">
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-900 font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar Overlay */}
      {isSearchOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b border-gray-200 p-4 shadow-lg animate-fade-in-down">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center">
            <Search className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search products..."
              className="flex-grow outline-none text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="button" onClick={() => setIsSearchOpen(false)}>
              <X className="text-gray-500" />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
