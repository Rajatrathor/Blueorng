import React, { useState } from 'react';
import { useRegisterMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await register({ name, email, mobile, password }).unwrap();
      dispatch(setCredentials(userData.data));
      navigate('/');
    } catch (err) {
      alert(err?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold uppercase text-center mb-8">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-3 uppercase font-bold tracking-widest hover:bg-gray-800 transition"
        >
          {isLoading ? 'Loading...' : 'Create Account'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-sm text-gray-600 hover:text-black">Already have an account? Log in</Link>
      </div>
    </div>
  );
};

export default Signup;
