import React, { useState } from 'react';
import axios from 'axios';

const TaskApiTestButton: React.FC = () => {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testTaskApi = async () => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      // Make direct API call to test connectivity
      console.log('Testing task API direct connection...');
      const response = await axios.get('/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('API Test Response:', response);

      if (response.data.success) {
        setTestResult(`API connection successful! Found ${response.data.data.length} tasks. Server responded with status ${response.status}.`);
      } else {
        setError(`API responded with an unsuccessful status: ${JSON.stringify(response.data)}`);
      }
    } catch (error: any) {
      console.error('API Test Error:', error);
      setError(
        `API connection failed: ${error.message}. ` +
        (error.response 
          ? `Server responded with status ${error.response.status}: ${JSON.stringify(error.response.data)}`
          : 'No response from server. Check if the backend is running.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button
          onClick={testTaskApi}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Task API Connection'}
        </button>
        <span className="ml-3 text-sm text-gray-500">
          Tests direct connection to the backend API
        </span>
      </div>

      {testResult && (
        <div className="p-3 bg-green-50 text-green-800 rounded-md">
          {testResult}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-800 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-medium">Debugging Tips:</h3>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Make sure your backend server is running</li>
          <li>Check that the proxy in package.json is correctly set to your backend URL</li>
          <li>Verify that your authentication token is valid</li>
          <li>Check browser console for detailed network errors</li>
          <li>Inspect Network tab in browser DevTools to see request/response details</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskApiTestButton; 