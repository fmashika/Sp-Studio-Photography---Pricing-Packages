import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpLogo } from '../SpLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin } = useApp();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

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

          <span className="text-[10px] font-extrabold text-[#eab308] tracking-[0.25em] uppercase">
            RESTRICTED ACCESS
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Sp Studio Login Portal
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Enter your private password to access studio operations and management.
          </p>
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
