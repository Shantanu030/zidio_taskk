import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock project data
  const project = {
    _id: id,
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX principles, focusing on improved user experience, faster load times, and mobile responsiveness. The project includes redesigning all main pages, implementing a new design system, and optimizing for SEO.',
    status: 'active',
    startDate: '2023-01-15',
    endDate: '2023-03-30',
    members: ['John Doe', 'Jane Smith', 'Bob Johnson'],
    tasks: [
      {
        _id: 't1',
        title: 'Design homepage mockup',
        status: 'completed',
        priority: 'high',
        assignedTo: 'Jane Smith',
        dueDate: '2023-01-30',
      },
      {
        _id: 't2',
        title: 'Implement responsive navigation',
        status: 'in-progress',
        priority: 'medium',
        assignedTo: 'John Doe',
        dueDate: '2023-02-15',
      },
      {
        _id: 't3',
        title: 'Optimize images and assets',
        status: 'pending',
        priority: 'low',
        assignedTo: 'Bob Johnson',
        dueDate: '2023-02-28',
      },
      {
        _id: 't4',
        title: 'Implement contact form',
        status: 'pending',
        priority: 'medium',
        assignedTo: 'Jane Smith',
        dueDate: '2023-03-10',
      },
    ],
  };

  // Simulate loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
            <div className="mt-1 flex items-center">
              <span
                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  project.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              <span className="ml-4 text-sm text-gray-500">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Project details */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-sm text-gray-500">{project.description}</p>

                <h2 className="mt-6 text-lg font-medium text-gray-900">Team Members</h2>
                <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.members.map((member, index) => (
                    <li key={index} className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
                        {member.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="ml-3 text-sm text-gray-700">{member}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Project stats */}
          <div>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">Project Stats</h2>
                <dl className="mt-4 grid grid-cols-1 gap-4">
                  <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Tasks</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{project.tasks.length}</dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Completed</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {project.tasks.filter(t => t.status === 'completed').length}
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">In Progress</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {project.tasks.filter(t => t.status === 'in-progress').length}
                    </dd>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Pending</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {project.tasks.filter(t => t.status === 'pending').length}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="mt-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
              <p className="mt-2 text-sm text-gray-500">
                A list of all tasks in this project including their status, priority, and assignee.
              </p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Priority
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Assigned To
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Due Date
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {project.tasks.map((task) => (
                      <tr key={task._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <Link
                            to={`/dashboard/tasks/${task._id}`}
                            className="hover:text-primary-600"
                          >
                            {task.title}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              task.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : task.status === 'in-progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              task.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {task.assignedTo}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            to={`/dashboard/tasks/${task._id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 