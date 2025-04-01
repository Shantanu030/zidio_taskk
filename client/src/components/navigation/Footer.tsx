import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/logo.svg"
              alt="Task Manager"
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-gray-500 text-center md:text-left">
              Streamline your workflow and boost productivity with our intuitive task management solution.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/dashboard/help"
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
              >
                Help Center
              </Link>
              <Link
                to="/dashboard/privacy"
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/dashboard/terms"
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="mailto:contact@taskmanager.com"
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <span className="sr-only">Email</span>
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-400">
            &copy; {currentYear} Task Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 