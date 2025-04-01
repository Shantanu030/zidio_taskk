import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { RootState, AppDispatch } from '../../store';
import {
  LayoutDashboard,
  ListTodo,
  FolderKanban,
  Calendar,
  Users,
  Settings,
  X,
  ChevronRight,
  Server,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
}> = ({ to, icon, children, end }) => (
  <NavLink to={to} end={end}>
    {({ isActive }) => (
      <div
        className={`group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600 hover:shadow-sm hover:ring-1 hover:ring-gray-200'
        }`}
      >
        <span className="flex items-center">
          <span className={`mr-3 transition-all duration-200 group-hover:scale-110 ${isActive ? 'text-primary-500' : ''}`}>
            {icon}
          </span>
          <span className="truncate">{children}</span>
        </span>
        {/* Active indicator */}
        <span
          className={`absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary-500 transition-all duration-200 ${
            isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50 group-hover:opacity-50'
          }`}
        />
      </div>
    )}
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();

  const handleCloseSidebar = () => {
    setIsOpen(false);
    dispatch(setSidebarOpen(false));
  };

  const navigationItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
    { to: '/tasks', icon: <ListTodo size={20} />, label: 'Tasks' },
    { to: '/projects', icon: <FolderKanban size={20} />, label: 'Projects' },
    { to: '/calendar', icon: <Calendar size={20} />, label: 'Calendar' },
    ...(user?.role === 'admin'
      ? [{ to: '/admin', icon: <Users size={20} />, label: 'Admin' }]
      : []),
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    // API Tester for development
    { to: '/api-tester', icon: <Server size={20} />, label: 'API Tester' },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isOpen ? 'visible' : 'invisible'
        } transition-all duration-300`}
      >
        {/* Sidebar panel */}
        <div
          className={`relative flex w-[280px] flex-col bg-white pb-4 pt-5 shadow-xl transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button */}
          <div className="absolute right-0 top-0 -mr-12 pt-2">
            <button
              type="button"
              className="group ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={handleCloseSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 transform transition-all duration-200 group-hover:rotate-90" aria-hidden="true" />
            </button>
          </div>

          {/* Sidebar content */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center px-4">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Task Manager"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Task Manager
              </span>
            </div>

            {/* Navigation */}
            <nav className="mt-6 flex-1 space-y-1 px-3">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  end={item.end}
                >
                  {item.label}
                </NavItem>
              ))}
            </nav>

            {/* User section */}
            {user && (
              <div className="border-t border-gray-200 p-4">
                <div className="group flex items-center rounded-lg p-2 transition-all duration-200 hover:bg-gray-50">
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-primary-200 transition-all duration-200 group-hover:ring-primary-400 group-hover:scale-110"
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                    alt=""
                  />
                  <div className="ml-3 min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 transition-colors duration-200 group-hover:text-primary-600">{user.name}</p>
                    <p className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-primary-500">{user.role}</p>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-gray-400 transition-all duration-200 group-hover:text-primary-500 group-hover:translate-x-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64">
        <div className="flex w-full flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            {/* Logo */}
            <div className="flex items-center px-4">
              <img
                className="h-8 w-auto transition-transform duration-200 hover:scale-105"
                src="/logo.svg"
                alt="Task Manager"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Task Manager
              </span>
            </div>

            {/* Navigation */}
            <nav className="mt-6 flex-1 space-y-1 px-3">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  end={item.end}
                >
                  {item.label}
                </NavItem>
              ))}
            </nav>
          </div>

          {/* User section */}
          {user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-primary-200"
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                  alt=""
                />
                <div className="ml-3 min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar; 