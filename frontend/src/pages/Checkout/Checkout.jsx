import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation, useVerifyPaymentMutation } from '../../features/orders/ordersApi';
import { useGetCartQuery } from '../../features/cart/cartApi';
import { useSelector } from 'react-redux';


const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { data: cart } = useGetCartQuery(undefined, { skip: !isAuthenticated, refetchOnMountOrArgChange: true });
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();


  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'COD',
  });

  const savedAddressAvailable = Boolean(
    user?.shippingAddressLine1 ||
    user?.shippingAddressLine2 ||
    user?.shippingCity ||
    user?.shippingState ||
    user?.shippingPostalCode ||
    user?.shippingCountry ||
    user?.shippingPhone
  );
  const [useSavedAddress, setUseSavedAddress] = useState(savedAddressAvailable);

  useEffect(() => {
    if (useSavedAddress && savedAddressAvailable) {
      setForm((prev) => ({
        ...prev,
        fullName: user?.name || prev.fullName,
        phone: user?.shippingPhone || prev.phone,
        addressLine1: user?.shippingAddressLine1 || prev.addressLine1,
        addressLine2: user?.shippingAddressLine2 || prev.addressLine2,
        city: user?.shippingCity || prev.city,
        state: user?.shippingState || prev.state,
        postalCode: user?.shippingPostalCode || prev.postalCode,
        country: user?.shippingCountry || prev.country,
      }));
    }
  }, [useSavedAddress, savedAddressAvailable, user]);

  const subtotal =
    cart?.items?.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0) || 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🟢 COD FLOW
      if (form.paymentMethod === 'COD') {
        await createOrder(form).unwrap();
        alert('Order placed successfully!');
        navigate('/profile');
        return;
      }



      // 🔵 RAZORPAY FLOW
      const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!ok) {
        alert('Razorpay SDK failed to load');
        return;
      }

      // ✅ CREATE FULL ORDER FIRST (address + items saved)
      const resp = await createOrder({
        ...form,
        paymentMethod: 'RAZORPAY',
      }).unwrap();

      console.log('RESP', resp); // debug once

      const payment = resp.data; // ✅ THIS IS THE FIX

      const options = {
        key: payment.keyId,
        amount: payment.amount, // already in paise
        currency: payment.currency,
        order_id: payment.razorpayOrderId,

        name: 'BluOrng Inspired Store',
        description: `Order #${payment.orderId}`,

        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();

          navigate('/profile');
        },

        modal: {
          ondismiss: () => {
            console.log('Razorpay closed by user');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();




    } catch (err) {
      console.error(err);
      alert(err?.data?.message || 'Payment failed');
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm font-medium mb-2">Shipping Address</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="addressSelection"
                    checked={useSavedAddress}
                    onChange={() => setUseSavedAddress(true)}
                    disabled={!savedAddressAvailable}
                  />
                  <span>
                    Use saved address
                    {!savedAddressAvailable && <span className="text-gray-500 ml-1">(no saved address)</span>}
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="addressSelection"
                    checked={!useSavedAddress}
                    onChange={() => setUseSavedAddress(false)}
                  />
                  <span>Enter a new address</span>
                </label>
              </div>
              {useSavedAddress && savedAddressAvailable && (
                <div className="mt-3 text-sm text-gray-700">
                  <p>{user?.shippingAddressLine1}{user?.shippingAddressLine2 ? `, ${user.shippingAddressLine2}` : ''}</p>
                  <p>{user?.shippingCity}, {user?.shippingState} {user?.shippingPostalCode}</p>
                  <p>{user?.shippingCountry}</p>
                  {user?.shippingPhone && <p>Phone: {user.shippingPhone}</p>}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                disabled={useSavedAddress}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                disabled={useSavedAddress}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input
                name="addressLine1"
                value={form.addressLine1}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                disabled={useSavedAddress}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input
                name="addressLine2"
                value={form.addressLine2}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                disabled={useSavedAddress}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                  disabled={useSavedAddress}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                  disabled={useSavedAddress}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                  disabled={useSavedAddress}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-black focus:border-black"
                  disabled={useSavedAddress}
                />
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={form.paymentMethod === 'COD'}
                    onChange={handleChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RAZORPAY"
                    checked={form.paymentMethod === 'RAZORPAY'}
                    onChange={handleChange}
                  />
                  <span>Razorpay (Card/UPI/Netbanking)</span>
                </label>

              </div>
              {form.paymentMethod !== 'COD' && (
                <div className="mt-3 text-xs text-gray-500">
                  Online payment uses Razorpay. Your order updates after payment.
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-md font-bold uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isLoading ? 'Placing...' : (form.paymentMethod === 'COD' ? 'Place Order' : 'Pay & Place Order')}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 p-6 h-fit">
          <h2 className="text-lg font-bold uppercase mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {cart?.items?.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>₹{(Number(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg mb-6 border-t border-gray-200 pt-4">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
