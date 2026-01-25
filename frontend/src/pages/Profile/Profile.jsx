import React, { useEffect, useState } from 'react';
import { useGetMyOrdersQuery } from '../../features/orders/ordersApi';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateMeMutation } from '../../features/users/usersApi';
import { useChangePasswordMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const { data: orders, isLoading } = useGetMyOrdersQuery();
  const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    // Shipping
    shippingAddressLine1: '',
    shippingAddressLine2: '',
    shippingCity: '',
    shippingState: '',
    shippingPostalCode: '',
    shippingCountry: '',
    shippingPhone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        shippingAddressLine1: user.shippingAddressLine1 || '',
        shippingAddressLine2: user.shippingAddressLine2 || '',
        shippingCity: user.shippingCity || '',
        shippingState: user.shippingState || '',
        shippingPostalCode: user.shippingPostalCode || '',
        shippingCountry: user.shippingCountry || '',
        shippingPhone: user.shippingPhone || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateMe(form).unwrap();
      dispatch(setCredentials({ user: updatedUser, token }));
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }).unwrap();
      alert('Password changed successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert(err?.data?.message || 'Failed to change password');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">My Profile</h1>
      <p className="mb-8 text-gray-600">Welcome back, {user?.name}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-sm mb-8">
            <h2 className="text-xl font-bold uppercase mb-4 border-b pb-2">Profile Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold uppercase mt-6 mb-3">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Address Line 1</label>
                <input
                  type="text"
                  name="shippingAddressLine1"
                  value={form.shippingAddressLine1}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="shippingAddressLine2"
                  value={form.shippingAddressLine2}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  name="shippingCity"
                  value={form.shippingCity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">State</label>
                <input
                  type="text"
                  name="shippingState"
                  value={form.shippingState}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="shippingPostalCode"
                  value={form.shippingPostalCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Country</label>
                <input
                  type="text"
                  name="shippingCountry"
                  value={form.shippingCountry}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                <input
                  type="text"
                  name="shippingPhone"
                  value={form.shippingPhone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-6 w-full bg-black text-white py-3 uppercase font-bold tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <form onSubmit={handlePasswordSubmit} className="bg-white border border-gray-200 p-6 rounded-sm">
            <h2 className="text-xl font-bold uppercase mb-4 border-b pb-2">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-black text-white py-3 uppercase font-bold tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-sm h-fit">
          <h2 className="text-xl font-bold uppercase mb-4 border-b pb-2">Current Shipping Address</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-700">{form.shippingAddressLine1}{form.shippingAddressLine2 ? `, ${form.shippingAddressLine2}` : ''}</p>
            <p className="text-sm text-gray-700">{form.shippingCity}, {form.shippingState} {form.shippingPostalCode}</p>
            <p className="text-sm text-gray-700">{form.shippingCountry}</p>
            {form.shippingPhone && <p className="text-sm text-gray-700">Phone: {form.shippingPhone}</p>}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold uppercase mb-4 border-b pb-2">Order History</h2>

      {!orders?.length ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 p-6 rounded-sm">
              <div className="flex justify-between mb-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-bold">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-bold">₹{Number(order.totalAmount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm font-semibold mb-2">Shipping Address</p>
                  <p className="text-sm text-gray-700">{order.fullName}</p>
                  <p className="text-sm text-gray-700">{order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ''}</p>
                  <p className="text-sm text-gray-700">{order.city}, {order.state} {order.postalCode}</p>
                  <p className="text-sm text-gray-700">{order.country}</p>
                  {order.phone && <p className="text-sm text-gray-700">Phone: {order.phone}</p>}
                  {order.paymentMethod && <p className="text-sm text-gray-700">Payment: {order.paymentMethod}</p>}
                </div>
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                      {item.product?.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium uppercase">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <div className="ml-auto">
                      <p className="font-medium">₹{Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
