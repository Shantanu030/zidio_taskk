import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NetworkConfigCheck: React.FC = () => {
  const [proxyConfig, setProxyConfig] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [apiUrls, setApiUrls] = useState({
    relative: '/api/tasks',
    absolute: `${window.location.origin}/api/tasks`,
    directBackend: 'http://localhost:5000/api/tasks'
  });

  // Function to check if we can detect the proxy configuration
  const checkNetworkConfig = async () => {
    setIsChecking(true);
    try {
      const packageJsonResponse = await fetch('/package.json');
      const packageJson = await packageJsonResponse.json();
      if (packageJson.proxy) {
        setProxyConfig(packageJson.proxy);
      } else {
        setProxyConfig('No proxy configuration found in package.json');
      }
    } catch (error) {
      console.error('Error fetching package.json:', error);
      setProxyConfig('Could not determine proxy configuration');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkNetworkConfig();
  }, []);

  return (
    <div className="mt-4">
      <h3 className="font-medium text-lg text-gray-800">Network Configuration</h3>
      
      <div className="mt-2 p-4 bg-gray-50 rounded-md">
        <div className="space-y-2">
          <div>
            <span className="font-medium">Proxy Configuration: </span>
            {isChecking ? (
              <span className="text-gray-500">Checking...</span>
            ) : proxyConfig ? (
              <span className="text-green-600">{proxyConfig}</span>
            ) : (
              <span className="text-red-600">Not found</span>
            )}
          </div>
          
          <div>
            <span className="font-medium">Base URL: </span>
            <span>{window.location.origin}</span>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium">API Endpoints:</h4>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
              <li>Relative: <code className="bg-gray-100 px-1">{apiUrls.relative}</code></li>
              <li>Absolute: <code className="bg-gray-100 px-1">{apiUrls.absolute}</code></li>
              <li>Direct Backend: <code className="bg-gray-100 px-1">{apiUrls.directBackend}</code></li>
            </ul>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium">Authentication:</h4>
            <div className="text-sm mt-1">
              {localStorage.getItem('token') ? (
                <div className="text-green-600">
                  ✓ Auth token found (length: {localStorage.getItem('token')?.length})
                </div>
              ) : (
                <div className="text-red-600">
                  ✗ No auth token found in localStorage
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-medium">Common Issues:</h4>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Missing proxy configuration in package.json</li>
          <li>Backend server not running on the expected port</li>
          <li>CORS issues preventing API access</li>
          <li>Missing or invalid authentication token</li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkConfigCheck; 