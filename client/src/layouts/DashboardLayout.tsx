import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import Footer from '../components/navigation/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, User } from '../store/slices/authSlice';
import { selectSidebarOpen, setSidebarOpen, setIsMobile } from '../store/slices/uiSlice';
import { RootState, AppDispatch } from '../store';

// Mock user for when authentication is disabled
const mockUser: User = {
  id: 'mock-user-id',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'admin' as 'admin' | 'manager' | 'employee',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const sidebarOpen = useSelector(selectSidebarOpen);

  // Use mock user if real user is null
  const currentUser = user || mockUser;

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setIsMobile(isMobile));
      if (!isMobile) {
        dispatch(setSidebarOpen(true));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  const handleSidebarToggle = (open: boolean) => {
    dispatch(setSidebarOpen(open));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar component for both mobile and desktop */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={handleSidebarToggle} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-20"
          onClick={() => handleSidebarToggle(false)}
        />
      )}

      {/* Main content wrapper */}
      <div className={`flex flex-col ${sidebarOpen ? 'md:pl-64' : ''} transition-all duration-300`}>
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={handleSidebarToggle}
          user={currentUser}
        />

        {/* Main content */}
        <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <div className="bg-white rounded-lg shadow-soft p-6">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout; 