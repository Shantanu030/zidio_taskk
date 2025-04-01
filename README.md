# Task Manager Application

A full-stack task management application built with MERN stack (MongoDB, Express.js, React, Node.js) to help users organize projects and tasks efficiently.

## Features

- **User Authentication**
  - Register, Login, Forgot Password, and Reset Password
  - JWT-based secure authentication
  - User profile management

- **Project Management**
  - Create, view, update, and delete projects
  - Track project progress and statistics
  - Filter projects by status and name

- **Task Management**
  - Create, view, update, and delete tasks
  - Associate tasks with projects
  - Set task priority and due dates
  - Filter tasks by status, project, priority, and search term
  - Update task status with a simple toggle

- **Dashboard**
  - Overview of project and task statistics
  - Quick access to pending tasks
  - Visual representation of project progress

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the root directory
   ```
   cd task-manager
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=7d
   RESET_TOKEN_EXPIRY=1h
   EMAIL_SERVICE=your_email_service  # e.g., gmail
   EMAIL_USERNAME=your_email_username
   EMAIL_PASSWORD=your_email_password
   CLIENT_URL=http://localhost:3000
   ```

4. Start the backend server
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory
   ```
   cd client
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the client directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend application
   ```
   npm start
   ```

## Usage Guide

### Authentication
- Register a new account with your email, name, and password
- Log in using your registered email and password
- Use the "Forgot Password" option if you need to reset your password

### Projects
- Create new projects with a name, description, and status
- View all projects on the Projects page
- Click on a project to see associated tasks
- Edit or delete projects as needed

### Tasks
- Create new tasks with title, description, status, priority, due date, and associated project
- View all tasks on the Tasks page
- Filter tasks by status (All, Pending, In Progress, Completed)
- Filter tasks by project and priority
- Search for tasks using the search bar
- Toggle task status directly from the task list
- Click on a task to view details or edit

### Dashboard
- View an overview of your projects and tasks
- See counts for total, in progress, and completed projects/tasks
- Access recent activity and pending tasks

## API Documentation

The backend provides RESTful API endpoints for all features:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Troubleshooting

- **Authentication Issues**: 
  - Check if your token is expired
  - Ensure your credentials are correct
  - Verify that the backend is running

- **Task/Project Creation Issues**: 
  - Verify that all required fields are filled
  - Check console for specific error messages
  - Try the direct API method if Redux is failing

- **Data Not Loading**: 
  - Confirm that the backend server is running
  - Check network requests for errors
  - Verify MongoDB connection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. 