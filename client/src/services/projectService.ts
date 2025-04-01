import axios from 'axios';
import { Project } from '../store/slices/projectSlice';

const API_URL = '/api/projects';

// Create axios instance with auth header
const axiosInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all projects
const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await axiosInstance().get(API_URL);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Get project by ID
const getProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await axiosInstance().get(`${API_URL}/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Project not found');
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw error;
  }
};

// Create new project
const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  try {
    const response = await axiosInstance().post(API_URL, projectData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to create project');
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update project
const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  try {
    const response = await axiosInstance().put(`${API_URL}/${id}`, projectData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update project');
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    throw error;
  }
};

// Delete project
const deleteProject = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance().delete(`${API_URL}/${id}`);
    if (!response.data.success) {
      throw new Error('Failed to delete project');
    }
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error);
    throw error;
  }
};

// Add project member
const addProjectMember = async (projectId: string, userId: string): Promise<Project> => {
  try {
    const response = await axiosInstance().post(`${API_URL}/${projectId}/members`, { userId });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to add member to project');
  } catch (error) {
    console.error(`Error adding member to project ${projectId}:`, error);
    throw error;
  }
};

// Remove project member
const removeProjectMember = async (projectId: string, userId: string): Promise<Project> => {
  try {
    const response = await axiosInstance().delete(`${API_URL}/${projectId}/members`, { 
      data: { userId } 
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to remove member from project');
  } catch (error) {
    console.error(`Error removing member from project ${projectId}:`, error);
    throw error;
  }
};

const projectService = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
};

export default projectService; 