import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { getTasks } from '../../store/slices/taskSlice';
import { getProjects } from '../../store/slices/projectSlice';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import CreateTaskButton from '../../components/tasks/CreateTaskButton';
import {
  BarChart,
  CheckCircle,
  Clock,
  ListTodo,
  Users,
  PlusCircle,
} from 'lucide-react';

const isProjectObject = (project: any): project is { _id: string; name: string; status?: string } => {
  return project && typeof project === 'object' && '_id' in project;
};

// Add a helper function to safely get project name
const getProjectName = (project: any): string => {
  if (!project) return 'No project';
  if (isProjectObject(project)) return project.name;
  return 'No project';
};

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, isLoading: tasksLoading } = useSelector((state: RootState) => state.tasks);
  const { projects, isLoading: projectsLoading } = useSelector((state: RootState) => state.projects);
  
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    dispatch(getTasks(undefined));
    dispatch(getProjects());
  }, [dispatch]);

  useEffect(() => {
    if (tasks && projects) {
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const pendingTasks = tasks.filter(task => task.status === 'pending').length;
      const overdueTasks = tasks.filter(task => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) < new Date() && task.status !== 'completed';
      }).length;
      
      const activeProjects = projects.filter(project => project.status === 'active').length;
      
      setStats({
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        overdueTasks,
        totalProjects: projects.length,
        activeProjects,
      });
    }
  }, [tasks, projects]);

  if (tasksLoading || projectsLoading) {
    return <Spinner />;
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name}! Here's an overview of your tasks and projects.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Stats cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ListTodo className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Total Tasks</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.totalTasks}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/tasks" className="font-medium text-primary-700 hover:text-primary-900">
                  View all
                </Link>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Completed Tasks</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.completedTasks}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/tasks" className="font-medium text-primary-700 hover:text-primary-900">
                  View all
                </Link>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Overdue Tasks</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.overdueTasks}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/tasks" className="font-medium text-primary-700 hover:text-primary-900">
                  View all
                </Link>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">Active Projects</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stats.activeProjects}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/projects" className="font-medium text-primary-700 hover:text-primary-900">
                  View all
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h2>
            <CreateTaskButton />
          </div>
          <div className="mt-2 overflow-hidden rounded-lg bg-white shadow">
            {tasks && tasks.length > 0 ? (
              <ul role="list" className="divide-y divide-gray-200">
                {tasks.slice(0, 5).map((task) => (
                  <li key={task._id} className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                          task.status === 'completed' ? 'bg-green-100' : 
                          task.status === 'in-progress' ? 'bg-blue-100' : 'bg-yellow-100'
                        }`}>
                          {task.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : task.status === 'in-progress' ? (
                            <Clock className="h-5 w-5 text-blue-500" />
                          ) : (
                            <ListTodo className="h-5 w-5 text-yellow-500" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="truncate text-sm text-gray-500">
                          {task.project ? `Project: ${getProjectName(task.project)}` : 'No project'}
                        </p>
                      </div>
                      <div>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                          {task.priority}
                        </div>
                      </div>
                      <div className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <PlusCircle className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first task.
                </p>
                <div className="mt-6">
                  <CreateTaskButton />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Productivity chart placeholder - simplified */}
        <div className="mt-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Productivity Overview</h2>
          <div className="mt-2 p-6 rounded-lg bg-white shadow text-center">
            <p className="text-gray-500">
              Analytics will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 