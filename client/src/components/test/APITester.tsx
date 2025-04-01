import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { getProjects, createProject } from '../../store/slices/projectSlice';
import { getTasks, createTask } from '../../store/slices/taskSlice';
import { AppDispatch, RootState } from '../../store';

const APITester: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const projects = useSelector((state: RootState) => state.projects);
  const tasks = useSelector((state: RootState) => state.tasks);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectStatus, setProjectStatus] = useState('');
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskPriority, setTaskPriority] = useState('');

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus('Logging in...');
    try {
      await dispatch(login({ email: loginEmail, password: loginPassword })).unwrap();
      setLoginStatus('Logged in successfully!');
    } catch (error: any) {
      setLoginStatus(`Login failed: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle create project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createProject({
        name: projectName,
        description: projectDesc,
        status: projectStatus as 'active' | 'completed' | 'archived',
        members: []
      })).unwrap();
      // Clear form
      setProjectName('');
      setProjectDesc('');
      setProjectStatus('');
      // Refresh projects
      dispatch(getProjects());
    } catch (error: any) {
      console.error('Failed to create project:', error);
    }
  };

  // Handle create task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get first project id for testing
      const firstProject = projects.projects.length > 0 
        ? { _id: projects.projects[0]._id, name: projects.projects[0].name }
        : undefined;
      
      await dispatch(createTask({
        title: taskTitle,
        description: taskDesc,
        status: taskStatus as 'pending' | 'in-progress' | 'completed',
        priority: taskPriority as 'low' | 'medium' | 'high',
        project: firstProject
      })).unwrap();
      // Clear form
      setTaskTitle('');
      setTaskDesc('');
      setTaskStatus('');
      setTaskPriority('');
      // Refresh tasks
      dispatch(getTasks(undefined));
    } catch (error: any) {
      console.error('Failed to create task:', error);
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      dispatch(getProjects());
      dispatch(getTasks(undefined));
    }
  }, [auth.isAuthenticated, dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">API Integration Tester</h1>
      
      {/* Login Form */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="border p-2 w-full"
              required
            />
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={auth.isLoading}
          >
            {auth.isLoading ? 'Logging in...' : 'Login'}
          </button>
          {loginStatus && <p className="mt-2">{loginStatus}</p>}
        </form>
      </div>
      
      {auth.isAuthenticated && (
        <>
          {/* Project Form */}
          <div className="mb-8 p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Create Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-3">
                <label className="block mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Description</label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Status</label>
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  className="border p-2 w-full"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={projects.isLoading}
              >
                {projects.isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
          
          {/* Task Form */}
          <div className="mb-8 p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Create Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="mb-3">
                <label className="block mb-1">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Description</label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Status</label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="border p-2 w-full"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="border p-2 w-full"
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="bg-purple-500 text-white px-4 py-2 rounded"
                disabled={tasks.isLoading}
              >
                {tasks.isLoading ? 'Creating...' : 'Create Task'}
              </button>
            </form>
          </div>
          
          {/* Data Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <h2 className="text-lg font-semibold mb-2">Projects</h2>
              {projects.isLoading ? (
                <p>Loading projects...</p>
              ) : projects.projects.length === 0 ? (
                <p>No projects found</p>
              ) : (
                <ul>
                  {projects.projects.map((project) => (
                    <li key={project._id} className="mb-2 p-2 border-b">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm">{project.description}</div>
                      <div className="text-xs">Status: {project.status}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="p-4 border rounded">
              <h2 className="text-lg font-semibold mb-2">Tasks</h2>
              {tasks.isLoading ? (
                <p>Loading tasks...</p>
              ) : tasks.tasks.length === 0 ? (
                <p>No tasks found</p>
              ) : (
                <ul>
                  {tasks.tasks.map((task) => (
                    <li key={task._id} className="mb-2 p-2 border-b">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm">{task.description}</div>
                      <div className="text-xs">
                        Status: {task.status} | Priority: {task.priority}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default APITester; 