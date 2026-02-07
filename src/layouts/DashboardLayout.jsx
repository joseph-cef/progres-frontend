import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 🔧 Club configuration – غيّر هذه القيم فقط
const clubConfig = {
  name: 'Cyber Nexus  Club',  
  subtitle: 'Progress Student Portal',  
  logoUrl: '/club-logo.jpg',  
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/cards', label: 'Student Cards', icon: '🎓' },
    { to: '/groups', label: 'Groups', icon: '👥' },
    { to: '/subjects', label: 'Subjects', icon: '📚' },
    { to: '/schedule', label: 'Schedule', icon: '🗓️' },
    { to: '/exam-grades', label: 'Exam Grades', icon: '🧪' },
    { to: '/cc-grades', label: 'CC Grades', icon: '📊' },
    { to: '/average-calculator', label: 'Average Calculator', icon: '🧮' },
    { to: '/transcripts', label: 'Transcripts', icon: '📄' },
    { to: '/about', label: 'About', icon: 'ℹ️' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.userName
    ? user.userName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('')
    : 'U';

  const clubInitials = clubConfig.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-gray-800 dark:from-gray-950 dark:via-slate-950 dark:to-slate-900 dark:text-gray-100">
      {menuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`
            bg-slate-950/95 backdrop-blur
            border-r border-slate-800
            md:w-64 w-72
            md:static fixed inset-y-0 left-0
            z-30 transform transition-transform duration-200
            ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
           <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/90 shadow-[0_0_25px_rgba(59,130,246,0.45)] ring-1 ring-slate-700/80 overflow-hidden">
                {clubConfig.logoUrl ? (
                  <img
                    src={clubConfig.logoUrl}
                    alt={clubConfig.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold tracking-tight text-slate-50">
                    {clubInitials || 'CL'}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-slate-50">
                  {clubConfig.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                  {clubConfig.subtitle}
                </span>
              </div>
            </div>
            {user && (
              <div className="hidden items-center gap-2 text-right md:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-100 ring-1 ring-slate-700">
                  {initials}
                </div>
              </div>
            )}
          </div>

           <nav className="mt-3 flex flex-1 flex-col px-3 pb-4 pt-1">
            <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Navigation
            </div>
            <div className="space-y-1">
              {links.map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-slate-800 text-slate-50 shadow-sm shadow-slate-900/40'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-slate-50',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full transition-colors ${
                          isActive
                            ? 'bg-blue-400'
                            : 'bg-transparent group-hover:bg-slate-500'
                        }`}
                      />
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/80 text-base shadow-inner shadow-black/40">
                        {icon}
                      </span>
                      <span className="truncate">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>

             <div className="mt-auto border-t border-slate-800 pt-3">
              {user && (
                <div className="mb-3 flex items-center gap-2 px-2">
 
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-100">
                      {user.userName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Logged in • Student
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-red-900/40 hover:bg-red-700 active:scale-[0.98] transition"
              >
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content area */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Mobile header */}
          <header className="flex items-center justify-between bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:bg-slate-900/90 md:hidden">
            <button
              className="text-2xl text-gray-700 dark:text-gray-200"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              ☰
            </button>
            <div className="flex flex-1 items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-900 text-[11px] font-semibold text-slate-50 shadow-[0_0_20px_rgba(59,130,246,0.5)] overflow-hidden">
                {clubConfig.logoUrl ? (
                  <img
                    src={clubConfig.logoUrl}
                    alt={clubConfig.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{clubInitials || 'CL'}</span>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold leading-tight">
                  {clubConfig.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Dashboard
                </span>
              </div>
            </div>
          </header>

           <header className="hidden items-center justify-between border-b border-slate-200 bg-white/85 px-6 py-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 md:flex">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-[11px] font-semibold text-slate-50 shadow-[0_0_20px_rgba(59,130,246,0.45)] overflow-hidden">
                {clubConfig.logoUrl ? (
                  <img
                    src={clubConfig.logoUrl}
                    alt={clubConfig.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{clubInitials || 'CL'}</span>
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Dashboard • Student Area
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {clubConfig.name}
                </p>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-100">
                    {user.userName}
                  </p>
                  <p className="text-[11px] text-slate-400">Logged in</p>
                </div>
 
              </div>
            )}
          </header>

           <main className="flex-1 overflow-y-auto px-3 py-4 md:px-6 md:py-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
