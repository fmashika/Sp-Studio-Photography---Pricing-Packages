import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpLogo } from '../SpLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin, loginWithGoogleAuth, firebaseUser, isFirebaseConnected } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the password');
      return;
    }

    const success = loginAdmin(password);
    if (success) {
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setAttempts((prev) => prev + 1);
      setError('Incorrect password. Please verify and try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setError('');
      await loginWithGoogleAuth();
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Google Authentication failed. Please try password login.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#0e0e0e] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(234,179,8,0.2)] text-white"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black hover:bg-white p-2 rounded-xl bg-[#1c1c1c] border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3">
            <SpLogo size="sm" showStudioText={false} />
          </div>

          <div className="w-10 h-10 rounded-2xl bg-[#eab308]/15 border border-[#eab308]/40 flex items-center justify-center mb-3 text-[#eab308] shadow-sm">
            <Lock className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eab308]/10 border border-[#eab308]/30 mb-1">
            <Sparkles className="w-3 h-3 text-[#eab308]" />
            <span className="text-[10px] font-extrabold text-[#eab308] tracking-[0.25em] uppercase">
              RESTRICTED ACCESS
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Sp Studio Login Portal
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Sign in with Google Admin or enter your private password to access studio operations.
          </p>
        </div>

        {/* Google Sign-In with Firebase button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/20 font-bold text-sm py-3.5 px-4 rounded-2xl transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign in with Google (Firebase)'}</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0e0e0e] px-3 text-[11px] uppercase tracking-wider text-gray-500 font-bold shrink-0">
              Or with password
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoFocus
                className="w-full bg-[#181818] border border-white/20 rounded-2xl px-4 py-3.5 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#eab308] focus:ring-1 focus:ring-[#eab308] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs animate-in fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#eab308] hover:bg-white hover:text-black text-black font-extrabold text-sm py-4 px-4 rounded-2xl shadow-xl shadow-[#eab308]/25 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
