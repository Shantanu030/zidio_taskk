import React, { useState } from 'react';
import axios from 'axios';

const DirectApiTestButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const createTestTask = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    // Get the auth token
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      setIsLoading(false);
      return;
    }
    
    console.log('DirectApiTest: Starting direct task creation test...');
    
    try {
      // Create a test task directly using axios
      const taskData = {
        title: 'Test Task ' + new Date().toISOString(),
        description: 'This is a test task created directly via Axios',
        status: 'pending',
        priority: 'medium'
      };
      
      console.log('DirectApiTest: Sending task data to backend:', taskData);
      console.log('DirectApiTest: Token length:', token.length);
      
      // Make direct API call
      const response = await axios.post('/api/tasks', taskData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 15000
      });
      
      console.log('DirectApiTest: Full response:', response);
      
      if (response.data && response.data.success) {
        setResult(`Task created successfully! Task ID: ${response.data.data._id}`);
      } else {
        setError(`Server responded with error: ${JSON.stringify(response.data)}`);
      }
    } catch (error: any) {
      console.error('DirectApiTest: Error creating task:', error);
      
      let errorMessage = 'Failed to create task: ' + error.message;
      
      if (error.response) {
        errorMessage += `\nStatus: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`;
        console.error('DirectApiTest: Error response:', error.response);
      } else if (error.request) {
        errorMessage += '\nNo response received from server. The server may be down or unreachable.';
        console.error('DirectApiTest: Request but no response:', error.request);
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
          onClick={createTestTask}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating Test Task...' : 'Create Test Task Directly'}
        </button>
        <span className="ml-3 text-sm text-gray-500">
          Bypasses Redux and creates a task directly using Axios
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
      
      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-medium">Connection Info:</h3>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>API Endpoint: /api/tasks</li>
          <li>Token Present: {localStorage.getItem('token') ? 'Yes' : 'No'}</li>
          <li>Token Length: {localStorage.getItem('token')?.length || 0}</li>
        </ul>
      </div>
    </div>
  );
};

export default DirectApiTestButton; 