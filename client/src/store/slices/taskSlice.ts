import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  } | string;
  project?: {
    _id: string;
    name: string;
    status?: string;
  } | string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  task: Task | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: TaskState = {
  tasks: [],
  task: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all tasks (optionally filtered by project)
export const getTasks = createAsyncThunk(
  'tasks/getAll',
  async (projectId: string | undefined, thunkAPI) => {
    try {
      console.log('taskSlice: Fetching tasks' + (projectId ? ` for project ${projectId}` : ''));
      const response = await taskService.getTasks(projectId);
      console.log('taskSlice: Fetched tasks successfully, count:', response.length);
      return response;
    } catch (error: any) {
      console.error('taskSlice: Error fetching tasks:', error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.error('taskSlice: Rejecting with error message:', message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get task by ID
export const getTaskById = createAsyncThunk(
  'tasks/getById',
  async (id: string, thunkAPI) => {
    try {
      return await taskService.getTask(id);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new task
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>, thunkAPI) => {
    try {
      console.log('taskSlice: Creating task with data:', taskData);
      
      // Log auth state
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('taskSlice: No auth token found in localStorage! Authentication might be missing.');
        return thunkAPI.rejectWithValue('Authentication token missing. Please log in again.');
      }
      console.log('taskSlice: Auth token is present with length:', token.length);
      
      // Create the task via the service
      console.log('taskSlice: Calling taskService.createTask...');
      const response = await taskService.createTask(taskData);
      console.log('taskSlice: Task created successfully:', response);
      return response;
    } catch (error: any) {
      console.error('taskSlice: Error creating task:', error);
      
      // Detailed error handling
      let errorMessage = '';
      
      if (error.response) {
        // Server responded with an error
        console.error('taskSlice: Server error response:', error.response);
        errorMessage = error.response.data?.message || 
          `Server error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        // No response received from server
        console.error('taskSlice: No response from server:', error.request);
        errorMessage = 'No response received from server. The server might be down or unreachable.';
      } else {
        // Error in making the request
        errorMessage = error.message || 'An unknown error occurred';
      }
      
      console.error('taskSlice: Rejecting with error message:', errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, taskData }: { id: string; taskData: Partial<Task> }, thunkAPI) => {
    try {
      console.log('taskSlice updateTask: Starting update for task', id, 'with data:', taskData);
      
      // Check for valid task ID
      if (!id) {
        throw new Error('Task ID is required');
      }
      
      // Check for valid status if updating status
      if (taskData.status && !['pending', 'in-progress', 'completed'].includes(taskData.status)) {
        throw new Error('Invalid task status value');
      }
      
      // Call the service
      const result = await taskService.updateTask(id, taskData);
      console.log('taskSlice updateTask: Task updated successfully, result:', result);
      return result;
    } catch (error: any) {
      console.error('taskSlice updateTask: Error updating task:', error);
      
      let message = '';
      if (error.response) {
        console.error('taskSlice updateTask: Server error details:', error.response.data);
        message = (error.response.data && error.response.data.message) || 
                 `Server error: ${error.response.status}`;
      } else if (error.request) {
        console.error('taskSlice updateTask: No response received from server');
        message = 'No response received from server. Please check your connection.';
      } else {
        message = error.message || error.toString();
      }
      
      console.error('taskSlice updateTask: Rejecting with message:', message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, thunkAPI) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get tasks by status
export const getTasksByStatus = createAsyncThunk(
  'tasks/getByStatus',
  async (status: string, thunkAPI) => {
    try {
      return await taskService.getTasksByStatus(status);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get tasks by priority
export const getTasksByPriority = createAsyncThunk(
  'tasks/getByPriority',
  async (priority: string, thunkAPI) => {
    try {
      return await taskService.getTasksByPriority(priority);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk for getting a single task by ID
export const getTask = createAsyncThunk(
  'tasks/getOne',
  async (id: string, thunkAPI) => {
    try {
      return await taskService.getTask(id);
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearTask: (state) => {
      state.task = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all tasks
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.tasks = [];
      })
      // Get task by ID
      .addCase(getTaskById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.task = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
        state.task = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get tasks by status
      .addCase(getTasksByStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasksByStatus.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasksByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get tasks by priority
      .addCase(getTasksByPriority.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasksByPriority.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload;
      })
      .addCase(getTasksByPriority.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get task
      .addCase(getTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.task = action.payload;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, clearTask } = taskSlice.actions;
export default taskSlice.reducer; 