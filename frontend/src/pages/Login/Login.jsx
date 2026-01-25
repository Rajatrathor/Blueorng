import React, { useState } from 'react';
import { useLoginMutation, useSendOtpMutation } from '../../features/auth/authApi';
import { setCredentials } from '../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [sendOtp, { isLoading: isOtpLoading }] = useSendOtpMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!identifier) {
      alert('Please enter your email or mobile number');
      return;
    }
    try {
      await sendOtp({ identifier }).unwrap();
      setOtpSent(true);
      alert('OTP sent to your registered email');
    } catch (err) {
      alert(err?.data?.message || 'Failed to send OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentials = { identifier };
      if (loginMode === 'password') {
        credentials.password = password;
      } else {
        credentials.otp = otp;
      }

      const response = await login(credentials).unwrap();
      const data = response.data;
      dispatch(
        setCredentials({
          user: { id: data.id, name: data.name, email: data.email, role: data.role },
          token: data.token,
        })
      );

      const role = data.role;
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold uppercase text-center mb-8">Login</h1>

      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 ${loginMode === 'password' ? 'border-b-2 border-black font-bold' : 'text-gray-500'}`}
          onClick={() => { setLoginMode('password'); setOtpSent(false); }}
        >
          Password
        </button>
        <button
          className={`px-4 py-2 ${loginMode === 'otp' ? 'border-b-2 border-black font-bold' : 'text-gray-500'}`}
          onClick={() => { setLoginMode('otp'); setOtpSent(false); }}
        >
          OTP
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email or Mobile Number</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            required
            disabled={otpSent && loginMode === 'otp'}
          />
        </div>

        {loginMode === 'password' && (
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
        )}

        {loginMode === 'otp' && (
          <>
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isOtpLoading}
                className="w-full bg-gray-200 text-black py-2 uppercase font-bold tracking-widest hover:bg-gray-300 transition"
              >
                {isOtpLoading ? 'Sending...' : 'Send OTP'}
              </button>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                  required
                />
              </div>
            )}
          </>
        )}

        {(loginMode === 'password' || (loginMode === 'otp' && otpSent)) && (
          <button
            type="submit"
            disabled={isLoginLoading}
            className="w-full bg-black text-white py-3 uppercase font-bold tracking-widest hover:bg-gray-800 transition"
          >
            {isLoginLoading ? 'Loading...' : 'Sign In'}
          </button>
        )}
      </form>

      <div className="mt-4 text-center space-y-2">
        <Link to="/forgot-password" className="block text-sm text-gray-600 hover:text-black">Forgot Password?</Link>
        <Link to="/signup" className="block text-sm text-gray-600 hover:text-black">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
