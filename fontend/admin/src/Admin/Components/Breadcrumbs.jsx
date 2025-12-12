import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If we are on the dashboard, we might not need breadcrumbs or just show "Dashboard"
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'admin')) {
      return null;
  }

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </li>
        {pathnames.map((value, index) => {
          // Skip "admin" if it's the first part of the path
          if (value === 'admin' && index === 0) return null;
          // Skip "dashboard" if it's the second part (since we hardcoded it)
          if (value === 'dashboard' && index === 1) return null;

          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
