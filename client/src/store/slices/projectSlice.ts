import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

export interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  startDate?: string;
  endDate?: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  project: Project | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: ProjectState = {
  projects: [],
  project: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all projects
export const getProjects = createAsyncThunk(
  'projects/getAll',
  async (_, thunkAPI) => {
    try {
      return await projectService.getProjects();
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

// Get project by ID
export const getProjectById = createAsyncThunk(
  'projects/getById',
  async (id: string, thunkAPI) => {
    try {
      return await projectService.getProjectById(id);
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

// Create new project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>, thunkAPI) => {
    try {
      return await projectService.createProject(projectData);
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

// Update project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, projectData }: { id: string; projectData: Partial<Project> }, thunkAPI) => {
    try {
      return await projectService.updateProject(id, projectData);
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

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id: string, thunkAPI) => {
    try {
      await projectService.deleteProject(id);
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

// Add project member
export const addProjectMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, userId }: { projectId: string; userId: string }, thunkAPI) => {
    try {
      return await projectService.addProjectMember(projectId, userId);
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

// Remove project member
export const removeProjectMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectId, userId }: { projectId: string; userId: string }, thunkAPI) => {
    try {
      return await projectService.removeProjectMember(projectId, userId);
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

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearProject: (state) => {
      state.project = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all projects
      .addCase(getProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get project by ID
      .addCase(getProjectById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.project = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Update project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = state.projects.map((project) =>
          project._id === action.payload._id ? action.payload : project
        );
        state.project = action.payload;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.projects = state.projects.filter((project) => project._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Add project member
      .addCase(addProjectMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addProjectMember.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.project = action.payload;
        // Update the project in the projects array as well
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(addProjectMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Remove project member
      .addCase(removeProjectMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeProjectMember.fulfilled, (state, action: PayloadAction<Project>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.project = action.payload;
        // Update the project in the projects array as well
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(removeProjectMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, clearProject } = projectSlice.actions;
export default projectSlice.reducer; 