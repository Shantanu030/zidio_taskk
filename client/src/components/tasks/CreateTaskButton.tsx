import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getTasks, createTask } from '../../store/slices/taskSlice';
import { getProjects } from '../../store/slices/projectSlice';
import { X, Plus } from 'lucide-react';

const CreateTaskButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects } = useSelector((state: RootState) => state.projects);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch projects when component mounts
  useEffect(() => {
    if (projects.length === 0) {
      dispatch(getProjects());
    }
  }, [dispatch, projects.length]);
  
  // Set default project when projects are loaded
  useEffect(() => {
    if (isModalOpen && projects.length > 0 && !projectId) {
      setProjectId(projects[0]._id);
    }
  }, [isModalOpen, projects, projectId]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setPriority('medium');
    setDueDate('');
    setProjectId(projects.length > 0 ? projects[0]._id : '');
    setError('');
    setSuccessMessage('');
  };
  
  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(getTasks(undefined)); // Refresh tasks
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');
      
      // Create task data following the backend's expected format
      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        status: status as 'pending' | 'in-progress' | 'completed',
        priority: priority as 'low' | 'medium' | 'high',
        ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
        ...(projectId && { project: projectId })
      };
      
      console.log('CreateTaskButton: Creating new task with data:', taskData);
      
      // Log authentication state for debugging
      const token = localStorage.getItem('token');
      console.log('CreateTaskButton: Auth token present:', !!token);
      if (token) {
        console.log('CreateTaskButton: Auth token length:', token.length);
      } else {
        console.error('CreateTaskButton: No auth token found! User might not be authenticated.');
        setError('Authentication token missing. Please log in again.');
        setIsSubmitting(false);
        return;
      }
      
      // Use Redux action to create task
      console.log('CreateTaskButton: Dispatching createTask action to Redux...');
      const result = await dispatch(createTask(taskData)).unwrap();
      console.log('CreateTaskButton: Task created successfully with response:', result);
      
      // Show success message
      setSuccessMessage('Task created successfully!');
      
      // Reset form after successful creation
      resetForm();
      
      // Refresh tasks immediately to show the new task
      console.log('CreateTaskButton: Refreshing tasks after successful task creation...');
      await dispatch(getTasks(undefined));
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error: any) {
      console.error('CreateTaskButton: Failed to create task:', error);
      
      // Provide more detailed error message
      let errorMessage = 'Failed to create task: ' + (error.message || 'Unknown error');
      
      // Check if error has response details
      if (error.response) {
        errorMessage += ` (Status: ${error.response.status})`;
        console.error('CreateTaskButton: Error response:', error.response);
      }
      
      // Show error to user
      setError(errorMessage);
      
      // Log more detailed debugging information
      console.error('CreateTaskButton: Full error object:', error);
      
      // Retry fetch tasks in case there was a successful creation despite the error
      try {
        console.log('CreateTaskButton: Attempting to refresh tasks despite error...');
        await dispatch(getTasks(undefined));
      } catch (refreshError) {
        console.error('CreateTaskButton: Error refreshing tasks:', refreshError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        <Plus className="-ml-1 mr-2 h-5 w-5" />
        New Task
      </button>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Create New Task</h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="mb-4 p-2 bg-green-50 text-green-600 text-sm rounded">
                  {successMessage}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter task title"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter task description"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                      disabled={isSubmitting}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                      disabled={isSubmitting}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                    Project
                  </label>
                  <select
                    id="project"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                    disabled={isSubmitting || projects.length === 0}
                  >
                    <option value="">None</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-75"
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTaskButton; 