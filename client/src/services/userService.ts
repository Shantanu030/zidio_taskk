import axios from 'axios';
import { User } from '../store/slices/authSlice';

const API_URL = '/api/users';

// Create axios instance with auth header
const axiosInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all users (admin only)
const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance().get(API_URL);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID (admin only)
const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await axiosInstance().get(`${API_URL}/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('User not found');
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// Create new user (admin only)
const createUser = async (userData: { name: string; email: string; password: string; role?: string }): Promise<User> => {
  try {
    const response = await axiosInstance().post(API_URL, userData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to create user');
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user (admin only)
const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await axiosInstance().put(`${API_URL}/${id}`, userData);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to update user');
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

// Delete user (admin only)
const deleteUser = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance().delete(`${API_URL}/${id}`);
    if (!response.data.success) {
      throw new Error('Failed to delete user');
    }
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Get users by role
const getUsersByRole = async (role: string): Promise<User[]> => {
  try {
    const response = await axiosInstance().get(`${API_URL}?role=${role}`);
    if (response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    throw error;
  }
};

const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole
};

export default userService; 