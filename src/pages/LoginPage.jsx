import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

 const clubInfo = {
  name: 'Cyber Nexus Club',  
  location: 'University of Tiaret – FMI',  
  logoUrl: '/club-logo.jpg',  
};

function getClubInitials(name) {
  if (!name) return 'CL';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

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

  const clubInitials = getClubInitials(clubInfo.name);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
       <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -right-10 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-16 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,118,110,0.22),_transparent_55%)]" />
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid gap-8 rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/80 backdrop-blur-2xl md:grid-cols-[1.05fr_1fr] md:p-8">
           <div className="flex flex-col justify-center space-y-6">
             <div className="mb-2 text-left">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 text-xs font-bold text-white shadow-[0_0_25px_rgba(59,130,246,0.7)] ring-1 ring-slate-700/80">
                  {clubInfo.logoUrl ? (
                    <img
                      src={clubInfo.logoUrl}
                      alt={clubInfo.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{clubInitials}</span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-200/80">
                    {clubInfo.location}
                  </p>
                  <p className="text-sm font-semibold text-slate-50">
                    {clubInfo.name}
                    <span className="ml-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300">
                      PROGRES Portal
                    </span>
                  </p>
                </div>
              </div>
            </div>

             <div className="space-y-1 text-left">
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Student Login
              </h1>
              <p className="text-sm text-slate-300">
                Sign in to{' '}
                <span className="font-semibold text-blue-300">
                  PROGRES – {clubInfo.location}
                </span>{' '}
                to access your academic dashboard, groups, and grades.
              </p>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                <span className="mt-0.5 text-lg">⚠️</span>
                <div>
                  <p className="font-semibold">Login failed</p>
                  <p className="text-xs opacity-90">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="Registration number"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                >
                  Registration number
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-600/80 bg-slate-900/70 px-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/70"
                    placeholder="202338013302"
                  />
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-500">
                    @
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
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
                    className="w-full rounded-lg border border-slate-600/80 bg-slate-900/70 px-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/40 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/70"
                    placeholder="••••••••"
                  />
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-slate-500">
                    🔒
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Access restricted to students of {clubInfo.location}</span>
               </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/40 transition hover:-translate-y-[1px] hover:from-blue-500 hover:to-cyan-400 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
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

            <p className="border-t border-white/5 pt-3 text-center text-[11px] text-slate-500">
              © {new Date().getFullYear()} {clubInfo.name}. All rights reserved.
            </p>
          </div>

           <div className="relative hidden flex-col justify-between rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/90 p-5 shadow-inner shadow-black/60 md:flex">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-200 ring-1 ring-slate-700/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure academic access
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  One place for your student journey
                </h2>
                <p className="mt-1 text-xs text-slate-300">
                  Use your official PROGRES credentials to sign in and access your groups,
                  schedule, transcripts, and exam grades – all in a single, unified portal.
                </p>
              </div>

              <ul className="mt-2 space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[13px]">📊</span>
                  <div>
                    <p className="font-medium text-slate-100">Track your progress</p>
                    <p className="text-[11px] text-slate-400">
                      View grades, CC marks, and exam results as soon as they are available.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[13px]">📅</span>
                  <div>
                    <p className="font-medium text-slate-100">Stay organized</p>
                    <p className="text-[11px] text-slate-400">
                      Check your official groups and schedule per semester and academic year.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[13px]">🔐</span>
                  <div>
                    <p className="font-medium text-slate-100">Secure by design</p>
                    <p className="text-[11px] text-slate-400">
                      Your credentials are used only to connect to the official PROGRES
                      services of your institution.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

         
          </div>
        </div>
      </div>
    </div>
  );
}
