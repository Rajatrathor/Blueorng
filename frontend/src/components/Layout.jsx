import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import CartSidebar from './CartSidebar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <CartSidebar />
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-bold tracking-tight">BluOrng</h4>
            <p className="text-sm text-gray-300 mt-2">Quality clothing designed for everyday comfort.</p>
          </div>
          <div>
            <h5 className="text-sm font-semibold uppercase">Shop</h5>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li><a href="/category/new-arrivals" className="hover:text-white">New Arrivals</a></li>
              <li><a href="/category/shop-all" className="hover:text-white">Shop All</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold uppercase">Support</h5>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li><a href="/profile" className="hover:text-white">My Account</a></li>
              <li><a href="/cart" className="hover:text-white">Cart</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold uppercase">Contact</h5>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li><a href="mailto:support@bluorng.example" className="hover:text-white">support@bluorng.example</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-300">
            © {new Date().getFullYear()} BluOrng Inspired. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
