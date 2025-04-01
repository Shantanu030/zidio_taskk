import axios from 'axios';
import { Task } from '../store/slices/taskSlice';

// Make sure the API URL is correct - might need to be the full URL in some environments
const API_URL = '/api/tasks';
// For debugging - log the base URL of requests
console.log('API URL used for tasks:', API_URL);

// Create axios instance with auth header
const axiosInstance = () => {
  // Get the auth token from localStorage
  const token = localStorage.getItem('token');
  
  // Debug token to understand authentication state
  if (!token) {
    console.warn('No authentication token found in localStorage. Requests may fail.');
  } else {
    console.log('Found authentication token with length:', token.length);
  }
  
  // Create axios instance with auth headers
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    // Set baseURL explicitly - might help with some configurations
    baseURL: '',
    timeout: 30000, // Increased timeout for slower connections
  });
  
  // Add request interceptor for debugging
  instance.interceptors.request.use(request => {
    console.log(`Making ${request.method?.toUpperCase()} request to: ${request.url}`);
    console.log('Request headers:', request.headers);
    if (request.data) {
      console.log('Request data:', request.data);
      
      // Special handling for PUT requests (task updates)
      if (request.method?.toLowerCase() === 'put') {
        console.log('PUT request detected (likely task update) - ensuring data is properly formatted');
      }
    }
    return request;
  }, error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  });
  
  // Add response interceptor for debugging
  instance.interceptors.response.use(
    response => {
      console.log(`Response from ${response.config.url}:`, response.status);
      console.log('Response data:', response.data);
      
      // Special handling for task updates
      if (response.config.method?.toLowerCase() === 'put') {
        console.log('PUT response received (likely task update):', {
          status: response.status,
          success: response.data?.success,
          data: response.data?.data
        });
      }
      
      return response;
    },
    error => {
      console.error('Request failed with error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // Additional error information for PUT requests
        if (error.config?.method?.toLowerCase() === 'put') {
          console.error('PUT request failed (likely task update):', {
            url: error.config.url,
            data: error.config.data,
            headers: error.config.headers
          });
        }
      } else if (error.request) {
        console.error('No response received. Request details:', error.request);
      }
      return Promise.reject(error);
    }
  );
  
  return instance;
};

// Get all tasks
const getTasks = async (projectId?: string): Promise<Task[]> => {
  try {
    console.log('getTasks: Fetching tasks from backend...');
    const url = projectId ? `${API_URL}?project=${projectId}` : API_URL;
    console.log('getTasks: Using URL:', url);
    
    const response = await axiosInstance().get(url);
    
    if (response.data && response.data.success === true) {
      console.log('getTasks: Successfully received tasks:', response.data.data.length);
      return response.data.data;
    } else {
      console.error('getTasks: Received unsuccessful response:', response.data);
      throw new Error(response.data?.message || 'Failed to fetch tasks');
    }
  } catch (error: any) {
    console.error('getTasks: Error fetching tasks:', error);
    throw error;
  }
};

// Get task by ID
const getTask = async (id: string): Promise<Task> => {
  try {
    console.log(`getTask: Fetching task with ID ${id}`);
    const response = await axiosInstance().get(`${API_URL}/${id}`);
    
    if (response.data && response.data.success === true) {
      console.log('getTask: Successfully received task');
      return response.data.data;
    } else {
      console.error('getTask: Received unsuccessful response:', response.data);
      throw new Error(response.data?.message || 'Task not found');
    }
  } catch (error: any) {
    console.error(`getTask: Error fetching task ${id}:`, error);
    throw error;
  }
};

// Create new task
const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  try {
    console.log('createTask: Starting task creation with data:', taskData);
    
    // Create a cleaner version of the task data
    const sanitizedData = {
      title: taskData.title,
      description: taskData.description || undefined, // Use undefined instead of empty string
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || undefined,
      project: taskData.project || undefined
    };
    
    console.log('createTask: Sending task data to backend:', sanitizedData);
    console.log('createTask: Using URL:', API_URL);
    
    // Send the request
    const response = await axiosInstance().post(API_URL, sanitizedData);
    
    // Log the full response for debugging
    console.log('createTask: Full task creation response:', response);
    
    // Verify the response structure and extract the task data
    if (response.data && response.data.success) {
      console.log('createTask: Task created successfully with ID:', response.data.data._id);
      return response.data.data;
    } else {
      console.error('createTask: Received unsuccessful response:', response.data);
      throw new Error(response.data?.message || 'Failed to create task - Server did not indicate success');
    }
  } catch (error: any) {
    console.error('createTask: Error creating task:', error);
    
    // Log more detailed error information
    if (error.response) {
      console.error('createTask: Error response data:', error.response.data);
      console.error('createTask: Error response status:', error.response.status);
      
      // Throw a more descriptive error
      const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error('createTask: No response received from server');
      throw new Error('No response received from server. Check your network connection and server status.');
    } else {
      console.error('createTask: Other error:', error.message);
      throw error;
    }
  }
};

// Update task
const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  try {
    console.log(`updateTask: Updating task ${id} with data:`, taskData);
    console.log(`updateTask: Using URL: ${API_URL}/${id}`);
    
    // Log token presence for debugging authentication issues
    const token = localStorage.getItem('token');
    console.log(`updateTask: Auth token present: ${!!token}, length: ${token?.length || 0}`);
    
    // Create a fresh axios instance specific for this request
    const instance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      baseURL: '',
      timeout: 15000, // Increased timeout
    });
    
    // Make the update request
    const response = await instance.put(`${API_URL}/${id}`, taskData);
    
    // Log full response for debugging
    console.log('updateTask: Full server response:', response);
    
    if (response.data && response.data.success) {
      console.log('updateTask: Task updated successfully, response data:', response.data.data);
      return response.data.data;
    } else {
      console.error('updateTask: Received unsuccessful response:', response.data);
      throw new Error(response.data?.message || 'Failed to update task');
    }
  } catch (error: any) {
    console.error(`updateTask: Error updating task ${id}:`, error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('updateTask: Server error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      console.error('updateTask: No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    }
    
    throw error;
  }
};

// Get tasks by status
const getTasksByStatus = async (status: string): Promise<Task[]> => {
  try {
    const response = await axiosInstance().get(`${API_URL}?status=${status}`);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching tasks with status ${status}:`, error);
    throw error;
  }
};

// Get tasks by priority
const getTasksByPriority = async (priority: string): Promise<Task[]> => {
  try {
    const response = await axiosInstance().get(`${API_URL}?priority=${priority}`);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching tasks with priority ${priority}:`, error);
    throw error;
  }
};

// Delete task
const deleteTask = async (id: string): Promise<void> => {
  try {
    console.log(`deleteTask: Deleting task ${id}`);
    const response = await axiosInstance().delete(`${API_URL}/${id}`);
    
    if (!response.data || !response.data.success) {
      console.error('deleteTask: Received unsuccessful response:', response.data);
      throw new Error(response.data?.message || 'Failed to delete task');
    }
    
    console.log('deleteTask: Task deleted successfully');
  } catch (error: any) {
    console.error(`deleteTask: Error deleting task ${id}:`, error);
    throw error;
  }
};

// Export all service functions
const taskService = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByPriority
};

export default taskService;