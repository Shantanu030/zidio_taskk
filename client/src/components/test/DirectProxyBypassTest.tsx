import React, { useState } from 'react';
import axios from 'axios';

const DirectProxyBypassTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testDirectConnection = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    // Get auth token
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('DirectProxyBypassTest: Testing direct connection to backend...');
      
      // Try to connect directly to the backend server
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      });
      
      console.log('DirectProxyBypassTest: Response:', response);
      
      if (response.data) {
        setResult(`Successfully connected directly to backend server! Found ${response.data.data?.length || 0} tasks.`);
      } else {
        setError('Received a response but no data. This is unusual.');
      }
    } catch (error: any) {
      console.error('DirectProxyBypassTest: Error connecting to backend:', error);
      
      let errorMessage = 'Failed to connect directly to backend: ' + error.message;
      
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = 'Network error: Cannot reach the backend server directly. This suggests the server may not be running, may be on a different port, or CORS might be blocking the request.';
      } else if (error.response) {
        errorMessage += `\nStatus: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button
          onClick={testDirectConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Direct Backend Connection'}
        </button>
        <span className="ml-3 text-sm text-gray-500">
          Bypasses proxy and connects directly to http://localhost:5000
        </span>
      </div>
      
      {result && (
        <div className="p-3 bg-green-50 text-green-800 rounded-md">
          {result}
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mt-2 text-sm text-gray-600">
        <p className="font-medium">This test:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Bypasses the React proxy</li>
          <li>Attempts to connect directly to the backend server at http://localhost:5000</li>
          <li>May fail due to CORS if the backend doesn't allow it</li>
          <li>Helps determine if the issue is with your proxy configuration</li>
        </ul>
      </div>
    </div>
  );
};

export default DirectProxyBypassTest; 