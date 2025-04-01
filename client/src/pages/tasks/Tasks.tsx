import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getTasks, updateTask, reset } from '../../store/slices/taskSlice';
import { getProjects } from '../../store/slices/projectSlice';
import CreateTaskButton from '../../components/tasks/CreateTaskButton';
import { RefreshCw, X } from 'lucide-react';

const isProjectObject = (project: any): project is { _id: string; name: string; status?: string } => {
  return project && typeof project === 'object' && '_id' in project;
};

const Tasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  
  const { tasks, isLoading, isError } = useSelector((state: RootState) => state.tasks);
  const { projects } = useSelector((state: RootState) => state.projects);

  // Function to fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      // Clear any error state
      if (isError) {
        dispatch(reset());
      }
      
      const result = await dispatch(getTasks(undefined)).unwrap();
      
      if (result.length === 0) {
        console.log('No tasks found in database');
      }
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      alert(`Failed to fetch tasks: ${error.message || 'Unknown error'}`);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, isError]);

  // Fetch tasks and projects when component mounts
  useEffect(() => {
    fetchTasks();
    
    // Fetch projects if not already loaded
    if (projects.length === 0) {
      dispatch(getProjects());
    }
    
  }, [dispatch, fetchTasks, projects.length]);

  // Filter tasks based on active tab, project filter, priority filter, and search term
  const filteredTasks = tasks.filter(task => {
    // Status filter (activeTab)
    if (activeTab !== 'all' && task.status !== activeTab) {
      return false;
    }
    
    // Project filter
    if (projectFilter !== 'all' && task.project) {
      if (isProjectObject(task.project)) {
        if (task.project._id !== projectFilter) return false;
      } else {
        if (task.project !== projectFilter) return false;
      }
    }
    
    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
      return false;
    }
    
    // Search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Handle task status toggle
  const handleTaskStatusToggle = async (task: any) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await dispatch(updateTask({
        id: task._id,
        taskData: { status: newStatus }
      })).unwrap();
      
      // Refresh tasks after update
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Function to handle clicking on a task to show details
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  // Function to close the task details modal
  const closeTaskDetails = () => {
    setShowTaskDetails(false);
    setSelectedTask(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="py-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          <div className="flex space-x-3">
            <button 
              onClick={fetchTasks}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <RefreshCw className={`-ml-0.5 mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <CreateTaskButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mt-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                All
                <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {tasks.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`${
                  activeTab === 'pending'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Pending
                <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {tasks.filter(task => task.status === 'pending').length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('in-progress')}
                className={`${
                  activeTab === 'in-progress'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                In Progress
                <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {tasks.filter(task => task.status === 'in-progress').length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`${
                  activeTab === 'completed'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
              >
                Completed
                <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {tasks.filter(task => task.status === 'completed').length}
                </span>
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="mt-4 flex items-center space-x-4">
            <div>
              <label htmlFor="project" className="sr-only">
                Filter by project
              </label>
              <select
                id="project"
                name="project"
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="sr-only">
                Filter by priority
              </label>
              <select
                id="priority"
                name="priority"
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="relative flex-grow">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search tasks..."
                className="block w-full rounded-md border-gray-300 pr-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Tasks list */}
          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
            {isLoading || isRefreshing ? (
              <div className="px-6 py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-500">Loading tasks...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                {tasks.length === 0 ? (
                  <div>
                    <p className="mb-4">No tasks found in the database</p>
                    <p className="mb-4">Click the "New Task" button to create your first task</p>
                  </div>
                ) : (
                  <p className="mb-4">No tasks match your filters</p>
                )}
                <button 
                  onClick={() => {
                    // Reset all filters
                    setActiveTab('all');
                    setProjectFilter('all');
                    setPriorityFilter('all');
                    setSearchTerm('');
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <li key={task._id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id={`task-${task._id}`}
                          name={`task-${task._id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={task.status === 'completed'}
                          onChange={() => handleTaskStatusToggle(task)}
                        />
                        <div className="ml-3">
                          <button
                            onClick={() => handleTaskClick(task)}
                            className="text-sm font-medium text-gray-900 hover:text-primary-600"
                          >
                            {task.title}
                          </button>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {task.project && isProjectObject(task.project) && (
                          <Link
                            to={`/projects/${task.project._id}`}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                          >
                            {task.project.name}
                          </Link>
                        )}
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-sm text-gray-500">
                          {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Task Details</h3>
              <button
                onClick={closeTaskDetails}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedTask.title}</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTask.description || 'No description provided'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedTask.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : selectedTask.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedTask.status === 'in-progress' ? 'In Progress' : 
                      selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Priority</h4>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedTask.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : selectedTask.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Due Date</h4>
                  <p className="text-gray-900">{selectedTask.dueDate ? formatDate(selectedTask.dueDate) : 'No due date'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Project</h4>
                  {selectedTask.project && isProjectObject(selectedTask.project) ? (
                    <Link 
                      to={`/projects/${selectedTask.project._id}`}
                      className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                      onClick={closeTaskDetails}
                    >
                      {selectedTask.project.name}
                    </Link>
                  ) : (
                    <p className="text-gray-900">No project assigned</p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Created At</h4>
                <p className="text-gray-900">{selectedTask.createdAt ? formatDate(selectedTask.createdAt) : 'Unknown'}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Updated At</h4>
                <p className="text-gray-900">{selectedTask.updatedAt ? formatDate(selectedTask.updatedAt) : 'Unknown'}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeTaskDetails}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Close
              </button>
              <Link
                to={`/tasks/${selectedTask._id}`}
                className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={closeTaskDetails}
              >
                Edit Task Status
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks; 