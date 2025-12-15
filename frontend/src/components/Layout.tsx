import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, Package, TrendingUp, TrendingDown, User } from 'lucide-react';

interface LayoutProps {
  onLogout: () => void;
}

export default function Layout({ onLogout }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Sellers', href: '/customers', icon: Users },
    { name: 'Buyers', href: '/buyers', icon: Users },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Purchases', href: '/purchases', icon: TrendingDown },
    { name: 'Sales', href: '/sales', icon: TrendingUp },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="flex items-center">
                  <img src="/logo.png" alt="Striply" className="h-32 w-auto" />
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? 'border-primary-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              <img src="/logo.png" alt="Striply" className="h-28 w-auto mb-2" />
              <p>© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Diabetic Test Strip Business Management System</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

