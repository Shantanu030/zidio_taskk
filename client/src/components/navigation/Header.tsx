import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { User } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings,
  X as CloseIcon,
} from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  setSidebarOpen,
  user,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex flex-1 justify-between px-4 md:px-6">
        <div className="flex flex-1">
          <button
            type="button"
            className="group border-r border-gray-200 px-4 text-gray-500 transition-all duration-200 hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={handleSidebarToggle}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6 transform transition-all duration-200 ease-in-out group-hover:scale-110" aria-hidden="true" />
          </button>
          <div className="flex w-full items-center px-4 md:px-6">
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-10 text-sm placeholder-gray-500 transition-all duration-200 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Search tasks, projects, etc."
              />
              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-all duration-200 hover:text-primary-600"
                >
                  <CloseIcon className="h-4 w-4 transform transition-all duration-200 hover:rotate-90" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center space-x-4 md:ml-6">
          {/* Notifications dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              className="group relative rounded-full bg-white p-1.5 text-gray-400 ring-1 ring-transparent transition-all duration-200 hover:bg-primary-50 hover:text-primary-600 hover:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6 transform transition-all duration-200 group-hover:scale-110" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white ring-2 ring-white transition-transform duration-200 group-hover:scale-110">
                3
              </span>
            </button>

            {/* Notifications dropdown panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 origin-top-right animate-fade-in rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="border-b border-gray-100 px-4 py-2">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto divide-y divide-gray-100">
                  <div className="px-4 py-3 transition-colors duration-200 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          John Doe
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Assigned you a new task: "Fix login page bug"
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 transition-colors duration-200 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Jane Smith
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Commented on your task: "Great job on this!"
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          5 hours ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 px-4 py-2">
                  <Link
                    to="/dashboard/notifications"
                    className="block text-center text-sm font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              className="group flex items-center rounded-full bg-white px-2 py-1 text-sm ring-1 ring-transparent transition-all duration-200 hover:bg-primary-50 hover:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              id="user-menu-button"
              aria-expanded={profileMenuOpen}
              aria-haspopup="true"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full ring-2 ring-white transition-all duration-200 group-hover:ring-primary-200"
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=random`}
                alt=""
              />
              <span className="ml-2 hidden text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-primary-600 md:block">
                {user?.name}
              </span>
              <ChevronDown
                className={`ml-1 hidden h-5 w-5 text-gray-400 transition-all duration-200 md:block ${
                  profileMenuOpen ? 'rotate-180 text-primary-600' : ''
                } group-hover:text-primary-600`}
                aria-hidden="true"
              />
            </button>

            {/* Profile dropdown panel */}
            {profileMenuOpen && (
              <div
                className="absolute right-0 mt-3 w-48 origin-top-right animate-fade-in rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex={-1}
              >
                <Link
                  to="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-primary-50 hover:text-primary-600"
                  role="menuitem"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <UserIcon
                    className="mr-3 h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-primary-500"
                    aria-hidden="true"
                  />
                  Your Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                  role="menuitem"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <Settings
                    className="mr-3 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  Settings
                </Link>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut
                    className="mr-3 h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-red-500"
                    aria-hidden="true"
                  />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 