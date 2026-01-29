import React from 'react';

// A minimal layout used for unauthenticated routes such as the login
// page.  It centres its children both horizontally and vertically
// against a neutral background, providing a nice frame for the
// authentication form.
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
      {children}
    </div>
  );
}