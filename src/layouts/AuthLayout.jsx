import React from 'react';

/**
 * Layout used on unauthenticated pages such as the login screen.  It
 * centres its children both horizontally and vertically and applies a
 * neutral background colour that adapts to dark mode.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
      {children}
    </div>
  );
}