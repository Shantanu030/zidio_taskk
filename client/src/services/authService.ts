import axios from 'axios';
import { User } from '../store/slices/authSlice';

const API_URL = '/api/auth';

// Create axios instance with auth header
const axiosInstance = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

class AuthServiceClass {
  async login({ email, password }: LoginCredentials) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    if (response.data.success && response.data.token) {
      const { token, user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      return user;
    }
    
    throw new Error('Login failed');
  }

  async register({ name, email, password }: RegisterData) {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    
    if (response.data.success && response.data.token) {
      const { token, user } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      return user;
    }
    
    throw new Error('Registration failed');
  }

  async forgotPassword(email: string) {
    const response = await axios.post(`${API_URL}/forgotpassword`, { email });
    return response.data;
  }

  async resetPassword(token: string, password: string) {
    const response = await axios.put(`${API_URL}/resetpassword/${token}`, { password });
    return response.data;
  }

  async validateResetToken(token: string) {
    try {
      const response = await axios.get(`${API_URL}/resetpassword/${token}`);
      return { isValid: response.data.success };
    } catch (error) {
      return { isValid: false };
    }
  }

  async getCurrentUser() {
    try {
      const response = await axiosInstance().get(`${API_URL}/me`);
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      throw error;
    }
  }

  async updatePassword(passwordData: { currentPassword: string; newPassword: string }) {
    const response = await axiosInstance().put(
      `${API_URL}/updatepassword`, 
      passwordData
    );
    return response.data;
  }

  async updateProfile(profileData: Partial<User>) {
    const response = await axiosInstance().put(
      `${API_URL}/updatedetails`, 
      profileData
    );
    
    if (response.data.success && response.data.user) {
      // Update local storage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    return response.data;
  }

  async uploadAvatar(formData: FormData) {
    const response = await axiosInstance().put(
      `/api/users/${JSON.parse(localStorage.getItem('user') || '{}').id}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    if (response.data.success && response.data.user) {
      // Update local storage with new avatar URL
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, avatar: response.data.user.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    return response.data;
  }

  logout() {
    axios.get(`${API_URL}/logout`).catch(error => console.error('Logout error:', error));
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}

const AuthService = new AuthServiceClass();
export default AuthService; 