import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from './features/auth/authApi';
import { setCredentials, logout } from './features/auth/authSlice';

import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Contact from './pages/Contact/Contact';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Category from './pages/Category/Category';
import Profile from './pages/Profile/Profile';

import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ProductList from './pages/Admin/ProductList';
import ProductForm from './pages/Admin/ProductForm';
import OrderList from './pages/Admin/OrderList';
import ContactList from './pages/Admin/ContactList';
import UserList from './pages/Admin/UserList';
import AdminTeam from './pages/Admin/AdminTeam';
import Categories from './pages/Admin/Categories';
import SearchResults from './pages/Search/SearchResults';
import Checkout from './pages/Checkout/Checkout';

function App() {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const authToken = useSelector((state) => state.auth.token);

  // Try to fetch user if token exists
  const { data: user, isError } = useGetMeQuery(undefined, { skip: !authToken });

  useEffect(() => {
    if (user) {
      if (!authUser || authUser.id !== user.id) {
        dispatch(setCredentials({ user, token: authToken }));
      }
    }
    if (isError) {
      dispatch(logout());
    }
  }, [user, isError, dispatch, authToken, authUser]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="category/:slug" element={<Category />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="contact" element={<Contact />} />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute roles={['USER']} />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute roles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="users" element={<UserList />} />
          <Route path="categories" element={<Categories />} />
          <Route element={<ProtectedRoute roles={['SUPER_ADMIN']} />}>
            <Route path="team" element={<AdminTeam />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
