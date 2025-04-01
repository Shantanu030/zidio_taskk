import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getTask, updateTask } from '../../store/slices/taskSlice';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [task, setTask] = useState<any>(null);
  const [error, setError] = useState('');

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to check if project is an object
  const isProjectObject = (project: any): project is { _id: string; name: string; status?: string } => {
    return project && typeof project === 'object' && '_id' in project;
  };

  // Fetch task data
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const taskData = await dispatch(getTask(id)).unwrap();
        setTask(taskData);
        setCurrentStatus(taskData.status);
      } catch (error: any) {
        console.error('Error fetching task:', error);
        setError('Failed to load task. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskData();
  }, [dispatch, id]);

  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value as 'pending' | 'in-progress' | 'completed');
  };

  // Save changes
  const handleSave = async () => {
    if (!id) {
      setError('Task ID is missing. Cannot update task.');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      console.log(`Attempting to update task ${id} status to:`, currentStatus);
      
      // Use the Redux method to update the task
      const result = await dispatch(updateTask({
        id,
        taskData: { status: currentStatus }
      })).unwrap();
      
      console.log('Task update result:', result);
      
      // Update local task state
      setTask(prev => ({
        ...prev,
        status: currentStatus
      }));
      
      // Show success message
      alert('Task status updated successfully!');
      
      // Return to tasks page
      navigate('/tasks');
    } catch (error: any) {
      console.error('Error updating task:', error);
      
      // Set a user-friendly error message
      setError(typeof error === 'string' ? error : error.message || 'Failed to update task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
        <button 
          onClick={() => navigate('/tasks')}
          className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-700">
          Task not found
        </div>
        <button 
          onClick={() => navigate('/tasks')}
          className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
        <button 
          onClick={() => navigate('/tasks')}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Back to Tasks
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          <p className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
        </div>

        <div className="px-6 py-5 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Status field */}
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  value={currentStatus}
                  onChange={handleStatusChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Priority (read-only) */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <div className="mt-1 pt-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  task.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            </div>

            {/* Due Date (read-only) */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <div className="mt-1 pt-2">
                <p className="text-sm text-gray-900">
                  {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                </p>
              </div>
            </div>

            {/* Project (read-only) */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                Project
              </label>
              <div className="mt-1 pt-2">
                {task.project && isProjectObject(task.project) ? (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {task.project.name}
                  </span>
                ) : (
                  <p className="text-sm text-gray-500">No project assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="mr-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails; 