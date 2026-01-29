import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Dashboard layout for authenticated users.  It provides a sidebar with
 * navigation links and a top bar that displays the logged in user's name
 * and a logout button.  An `Outlet` is used to render nested routes
 * within the main content area.
 */
export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/cards', label: 'Student Cards' },
    { to: '/bac-info', label: 'Bac Info' },
    { to: '/groups', label: 'Groups' },
    { to: '/subjects', label: 'Subjects' },
    { to: '/schedule', label: 'Schedule' },
    { to: '/exam-grades', label: 'Exam Grades' },
    { to: '/exam-schedule', label: 'Exam Schedule' },
    { to: '/cc-grades', label: 'CC Grades' },
    { to: '/transcripts', label: 'Transcripts' },
    { to: '/accommodation', label: 'Accommodation' },
    { to: '/transport', label: 'Transport' },
    { to: '/discharge', label: 'Discharge' },
    { to: '/profile', label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-gray-800 md:w-64 w-full md:block ${menuOpen ? 'block' : 'hidden'} md:relative shadow-md`}> 
        <div className="p-4 text-2xl font-bold border-b dark:border-gray-700">Progres</div>
        <nav className="p-4 space-y-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow px-4 py-3 md:hidden">
          <button
            className="text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <div className="flex-1 text-center text-lg font-semibold">Progres</div>
          <div></div>
        </header>
        <header className="hidden md:flex items-center justify-between bg-white dark:bg-gray-800 shadow px-4 py-3">
          <div className="text-lg font-semibold">Dashboard</div>
          <div className="flex items-center space-x-4">
            {user && <span className="text-sm">{user.userName}</span>}
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}