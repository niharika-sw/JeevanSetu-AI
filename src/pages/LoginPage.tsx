import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, setCurrentPage } = useApp();
  const [email, setEmail] = useState('admin@jeevansetu.ai');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const ok = await login(email, password, false);
      if (ok) {
        setCurrentPage('dashboard');
      } else {
        setError('Authentication failed. Check credentials.');
      }
    } catch (err) {
      setError('Connection error. Try clicking "Try Demo".');
    } finally {
      setLoading(false);
    }
  };

  const handleTryDemo = async () => {
    setLoading(true);
    await login('admin@jeevansetu.ai', 'demo123', true);
    setCurrentPage('dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Tech Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center Auth Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white font-black text-2xl shadow-xl shadow-rose-600/30 mb-4">
            JS
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center space-x-2">
            <span>JeevanSetu</span>
            <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded font-black">AI</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Intelligent Accident Detection & Emergency Response
          </p>
          <p className="text-xs text-rose-400/90 font-mono mt-1 font-semibold">
            &ldquo;Detect. Respond. Save Seconds.&rdquo;
          </p>
        </div>

        {/* Demo Credentials Quick Pill */}
        <div className="mb-6 p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Demo Credentials:</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
              Ready
            </span>
          </div>
          <div className="font-mono text-slate-400 flex justify-between">
            <span>Email:</span>
            <span className="text-slate-200">admin@jeevansetu.ai</span>
          </div>
          <div className="font-mono text-slate-400 flex justify-between">
            <span>Password:</span>
            <span className="text-slate-200">demo123</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="admin@jeevansetu.ai"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Try Demo Direct Button */}
        <div className="mt-4 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleTryDemo}
            disabled={loading}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-sm border border-slate-700/80 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Try Demo (Direct Access)</span>
          </button>
        </div>

        {/* Disclaimer Footer */}
        <p className="text-[11px] text-slate-500 text-center mt-6 font-mono">
          Demo Environment • Synthetic Emergency Data
        </p>
      </div>
    </div>
  );
};
