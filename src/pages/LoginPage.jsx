import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login form allowing a student to enter their username and
 * password.  On submit it calls the login method provided by
 * AuthContext which communicates with the backend.  Successful
 * authentication stores the user in localStorage and navigates
 * back to the page the user originally requested.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username.trim(), password.trim());
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-blue-900 px-4">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -right-20 w-72 h-72 bg-blue-500/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -left-16 w-80 h-80 bg-cyan-400/20 blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md">
        {/* header badge */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              FMI
            </div>
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-[0.25em] text-blue-200/80">
                University of Tiaret
              </p>
              <p className="text-sm font-semibold text-slate-50">
                PROGRES FMI Tiaret
              </p>
            </div>
          </div>
        </div>

        <div className="w-full space-y-6 p-8 bg-slate-900/90 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Student Login
            </h1>
            <p className="text-sm text-slate-300">
              Sign in to <span className="font-semibold text-blue-300">PROGRES FMI Tiaret</span>{' '}
              to view your grades and academic information.
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-100 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium uppercase tracking-wide text-slate-300 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full border border-slate-600/80 rounded-lg px-10 py-2.5 text-sm bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-400 transition"
                  placeholder="e.g. fmi.2023.xx"
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm">
                  @
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wide text-slate-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-slate-600/80 rounded-lg px-10 py-2.5 text-sm bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-400 transition"
                  placeholder="••••••••"
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">
                  🔒
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Access restricted to FMI Tiaret students</span>
              <span className="italic text-slate-500">PROGRES DZ</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-700/40 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 transform hover:-translate-y-[1px] active:translate-y-0 transition"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="pt-2 border-t border-white/5 text-[11px] text-center text-slate-500">
            © {new Date().getFullYear()} PROGRES FMI Tiaret. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
