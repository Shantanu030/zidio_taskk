"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const Project_1 = __importDefault(require("../models/Project"));
const sendResponse_1 = require("../utils/sendResponse");
// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
    try {
        let query = {};
        // Filter tasks by project if provided
        if (req.query.project) {
            query.project = req.query.project;
        }
        // Filter tasks by status if provided
        if (req.query.status) {
            query.status = req.query.status;
        }
        // Filter tasks by priority if provided
        if (req.query.priority) {
            query.priority = req.query.priority;
        }
        // For regular users, only show tasks they created or are assigned to
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            query = {
                ...query,
                $or: [
                    { assignedTo: req.user._id },
                    { createdBy: req.user._id }
                ]
            };
        }
        const tasks = await Task_1.default.find(query)
            .populate({
            path: 'project',
            select: 'name status',
        })
            .populate({
            path: 'assignedTo',
            select: 'name email avatar',
        })
            .populate({
            path: 'createdBy',
            select: 'name email avatar',
        });
        (0, sendResponse_1.sendSuccessResponse)(res, 'Tasks retrieved successfully', tasks);
    }
    catch (error) {
        next(error);
    }
};
exports.getTasks = getTasks;
// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
    try {
        const task = await Task_1.default.findById(req.params.id)
            .populate({
            path: 'project',
            select: 'name status',
        })
            .populate({
            path: 'assignedTo',
            select: 'name email avatar',
        })
            .populate({
            path: 'createdBy',
            select: 'name email avatar',
        });
        if (!task) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Task not found', 404);
        }
        // Check if user has access to this task
        const isAdmin = req.user.role === 'admin';
        const isManager = req.user.role === 'manager';
        const isCreator = task.createdBy._id.toString() === req.user._id.toString();
        const isAssigned = task.assignedTo && task.assignedTo._id.toString() === req.user._id.toString();
        if (!isAdmin && !isManager && !isCreator && !isAssigned) {
            // Check if user is a member of the project
            if (task.project) {
                const project = await Project_1.default.findById(task.project);
                const isProjectMember = project && project.members.includes(req.user._id);
                if (!isProjectMember) {
                    return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to access this task', 403);
                }
            }
            else {
                return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to access this task', 403);
            }
        }
        (0, sendResponse_1.sendSuccessResponse)(res, 'Task retrieved successfully', task);
    }
    catch (error) {
        next(error);
    }
};
exports.getTask = getTask;
// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate, assignedTo, project } = req.body;
        // Check if project exists if project ID is provided
        if (project) {
            const projectExists = await Project_1.default.findById(project);
            if (!projectExists) {
                return (0, sendResponse_1.sendErrorResponse)(res, 'Project not found', 404);
            }
            // Check if user has access to this project
            const isAdmin = req.user.role === 'admin';
            const isManager = req.user.role === 'manager';
            const isCreator = projectExists.createdBy.toString() === req.user._id.toString();
            const isMember = projectExists.members.includes(req.user._id);
            if (!isAdmin && !isManager && !isCreator && !isMember) {
                return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to create tasks for this project', 403);
            }
        }
        // Create the task
        const task = await Task_1.default.create({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            project,
            createdBy: req.user._id
        });
        const populatedTask = await Task_1.default.findById(task._id)
            .populate({
            path: 'project',
            select: 'name status',
        })
            .populate({
            path: 'assignedTo',
            select: 'name email avatar',
        })
            .populate({
            path: 'createdBy',
            select: 'name email avatar',
        });
        (0, sendResponse_1.sendSuccessResponse)(res, 'Task created successfully', populatedTask, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate, assignedTo, project } = req.body;
        let task = await Task_1.default.findById(req.params.id);
        if (!task) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Task not found', 404);
        }
        // Check if user has permission to update the task
        const isAdmin = req.user.role === 'admin';
        const isManager = req.user.role === 'manager';
        const isCreator = task.createdBy.toString() === req.user._id.toString();
        const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
        if (!isAdmin && !isManager && !isCreator && !isAssigned) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to update this task', 403);
        }
        // If project is being changed, check if user has access to new project
        if (project && (!task.project || task.project.toString() !== project)) {
            const projectExists = await Project_1.default.findById(project);
            if (!projectExists) {
                return (0, sendResponse_1.sendErrorResponse)(res, 'Project not found', 404);
            }
            const isProjectCreator = projectExists.createdBy.toString() === req.user._id.toString();
            const isProjectMember = projectExists.members.includes(req.user._id);
            if (!isAdmin && !isManager && !isProjectCreator && !isProjectMember) {
                return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to assign tasks to this project', 403);
            }
        }
        // Update the task
        task = await Task_1.default.findByIdAndUpdate(req.params.id, {
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            project
        }, { new: true, runValidators: true })
            .populate({
            path: 'project',
            select: 'name status',
        })
            .populate({
            path: 'assignedTo',
            select: 'name email avatar',
        })
            .populate({
            path: 'createdBy',
            select: 'name email avatar',
        });
        (0, sendResponse_1.sendSuccessResponse)(res, 'Task updated successfully', task);
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task_1.default.findById(req.params.id);
        if (!task) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Task not found', 404);
        }
        // Check if user has permission to delete the task
        const isAdmin = req.user.role === 'admin';
        const isManager = req.user.role === 'manager';
        const isCreator = task.createdBy.toString() === req.user._id.toString();
        if (!isAdmin && !isManager && !isCreator) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to delete this task', 403);
        }
        await task.deleteOne();
        (0, sendResponse_1.sendSuccessResponse)(res, 'Task deleted successfully', null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
