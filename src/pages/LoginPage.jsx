import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-blue-900 px-4">
      {/* Glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-16 w-72 h-72 bg-blue-500/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              FMI
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.25em] text-blue-200/80">
                University of Tiaret
              </p>
              <p className="text-sm font-medium text-slate-100">
                PROGRES – FMI Tiaret
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full space-y-6 p-8 rounded-2xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Student Portal
            </h1>
            <p className="text-sm text-slate-300">
              Connectez-vous à <span className="font-semibold text-blue-300">PROGRES FMI Tiaret</span>
              <br />
              pour consulter vos notes et informations pédagogiques.
            </p>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-100 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-xs font-medium uppercase tracking-wide text-slate-300"
              >
                Nom d&apos;utilisateur
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-600/70 bg-slate-900/60 px-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-400 transition"
                  placeholder="ex: 202312345678"
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm">
                  @
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wide text-slate-300"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-600/70 bg-slate-900/60 px-10 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-400 transition"
                  placeholder="••••••••"
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 text-xs">
                  🔒
                </span>
              </div>
            </div>



            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-700/40 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-[1px] transition"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
                  Connexion en cours…
                </>
              ) : (
                <>Se connecter</>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-white/5 text-[11px] text-center text-slate-500">
            © {new Date().getFullYear()} PROGRES FMI Tiaret – 
          </div>
        </div>
      </div>
    </div>
  );
}
