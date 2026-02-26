import React, { useState } from 'react';
import { Lock, User, ArrowRight, Phone, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { AuthResponse } from '../types';

interface LoginProps {
  onLogin: (auth: AuthResponse) => void;
}

type AuthStep = 'LOGIN' | 'FORGOT_PASSWORD' | 'VERIFY_OTP' | 'RESET_PASSWORD';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockInfo, setLockInfo] = useState<{ locked_until: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: staffId, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data);
      } else {
        if (data.error === 'ACCOUNT_LOCKED') {
          setLockInfo({ locked_until: data.locked_until });
          setError(`Account locked until ${new Date(data.locked_until).toLocaleTimeString()}`);
        } else {
          setError(data.error || 'Login failed');
        }
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });
      if (response.ok) {
        setStep('VERIFY_OTP');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to request reset');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, otp_6_digit: otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setResetToken(data.reset_token);
        setStep('RESET_PASSWORD');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_token: resetToken, new_password: newPassword }),
      });
      if (response.ok) {
        setStep('LOGIN');
        setError('Password updated. Please login.');
      } else {
        const data = await response.json();
        setError(data.error || 'Reset failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'LOGIN':
        return (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Staff ID</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full bg-[#1a1d29] text-white border border-gray-700 rounded-lg py-3 pl-12 pr-4 outline-none focus:border-yellow-400 transition-colors placeholder-gray-600"
                  placeholder="8842-A"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => setStep('FORGOT_PASSWORD')}
                  className="text-yellow-400/70 hover:text-yellow-400 text-[10px] uppercase font-bold tracking-widest transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1d29] text-white border border-gray-700 rounded-lg py-3 pl-12 pr-4 outline-none focus:border-yellow-400 transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!lockInfo}
              className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-[#1a1d29] font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all ${isLoading || !!lockInfo ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:-translate-y-0.5'}`}
            >
              {isLoading ? <span className="animate-pulse">Authenticating...</span> : <>Access System <ArrowRight size={18} /></>}
            </button>
          </form>
        );

      case 'FORGOT_PASSWORD':
        return (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-white font-bold text-lg">Recovery Request</h2>
              <p className="text-gray-400 text-xs mt-1">Enter your registered phone number to receive an OTP.</p>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#1a1d29] text-white border border-gray-700 rounded-lg py-3 pl-12 pr-4 outline-none focus:border-yellow-400 transition-colors placeholder-gray-600"
                  placeholder="5550123"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#1a1d29] font-bold py-3.5 rounded-lg transition-all"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
            <button
              type="button"
              onClick={() => setStep('LOGIN')}
              className="w-full text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-gray-300"
            >
              Back to Login
            </button>
          </form>
        );

      case 'VERIFY_OTP':
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-4">
              <ShieldCheck className="mx-auto text-yellow-400 mb-2" size={32} />
              <h2 className="text-white font-bold text-lg">Verify Identity</h2>
              <p className="text-gray-400 text-xs mt-1">Enter the 6-digit code sent to {phoneNumber}</p>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">OTP Code</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <KeyRound size={18} />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-[#1a1d29] text-white border border-gray-700 rounded-lg py-3 pl-12 pr-4 outline-none focus:border-yellow-400 transition-colors text-center tracking-[0.5em] text-xl font-bold"
                  placeholder="000000"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#1a1d29] font-bold py-3.5 rounded-lg transition-all"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        );

      case 'RESET_PASSWORD':
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-white font-bold text-lg">Reset Password</h2>
              <p className="text-gray-400 text-xs mt-1">Create a new secure password for your account.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#1a1d29] text-white border border-gray-700 rounded-lg py-3 px-4 outline-none focus:border-yellow-400 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#1a1d29] text-white border border-gray-700 rounded-lg py-3 px-4 outline-none focus:border-yellow-400 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#1a1d29] font-bold py-3.5 rounded-lg transition-all"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1d29] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 animate-fadeIn">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="mb-6 relative">
            <svg
              className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.4)]"
              viewBox="0 0 44.51 42.38"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="currentColor" d="M28.76.2c21.05,8.29,21.12,34.66-.48,42.1-.74.25-1.55-.15-1.79-.9-.24-.72.13-1.5.83-1.77,3.75-1.48,7.1-3.9,9.45-7.03,7.87-10.31,1.76-23.46-9.93-27.07-3.62-1.32-1.72-6.62,1.92-5.33h0Z" />
              <path fill="currentColor" d="M16.23,42.3C-5.38,34.85-5.28,8.49,15.75.2c1.46-.58,3.11.14,3.68,1.61.59,1.51-.22,3.23-1.76,3.73-3.6,1.18-6.93,3.28-9.38,6.14-5.2,5.78-5.42,14.81-.55,20.94,2.36,3.12,5.71,5.55,9.45,7.03,1.68.67.77,3.22-.96,2.67h0Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-[0.2em] mb-4 drop-shadow-lg uppercase">Agartha World</h1>
          <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">Crew Portal</p>
        </div>

        <div className="bg-[#2d3142] p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent opacity-50" />

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-xs animate-shake">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {renderStep()}
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-8 uppercase tracking-widest">
          Restricted Access • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default Login;
