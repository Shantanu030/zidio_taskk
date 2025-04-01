import { User } from '../store/slices/authSlice';

export interface DummyUser extends User {
  password: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

export const dummyUsers: DummyUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456',
    role: 'manager',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    password: 'password789',
    role: 'employee',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson&background=random',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
];

export const dummyNotifications = [
  {
    id: '1',
    userId: '1',
    title: 'Welcome to Task Manager',
    message: 'Get started by creating your first task!',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '1',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated.',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    userId: '1',
    title: 'New Task Assigned',
    message: 'You have been assigned a new task by the admin.',
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
]; 