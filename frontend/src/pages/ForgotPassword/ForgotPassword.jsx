import React, { useState } from 'react';
import { useSendOtpMutation, useResetPasswordMutation } from '../../features/auth/authApi';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password

  const [sendOtp, { isLoading: isOtpLoading }] = useSendOtpMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await sendOtp({ identifier }).unwrap();
      setStep(2);
      alert('OTP sent to your registered email');
    } catch (err) {
      alert(err?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ identifier, otp, newPassword }).unwrap();
      alert('Password reset successful. Please login with new password.');
      navigate('/login');
    } catch (err) {
      alert(err?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold uppercase text-center mb-8">Forgot Password</h1>
      
      {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email or Mobile Number</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isOtpLoading}
            className="w-full bg-black text-white py-3 uppercase font-bold tracking-widest hover:bg-gray-800 transition"
          >
            {isOtpLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-6">
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
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isResetLoading}
            className="w-full bg-black text-white py-3 uppercase font-bold tracking-widest hover:bg-gray-800 transition"
          >
            {isResetLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
