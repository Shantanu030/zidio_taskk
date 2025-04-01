"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProjectMember = exports.addProjectMember = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const sendResponse_1 = require("../utils/sendResponse");
// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
    try {
        let query = {};
        // If not admin or manager, only get projects the user is a member of
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            query = {
                $or: [
                    { members: req.user._id },
                    { createdBy: req.user._id }
                ]
            };
        }
        const projects = await Project_1.default.find(query)
            .populate('members', 'name email role avatar')
            .populate('createdBy', 'name email role avatar');
        (0, sendResponse_1.sendSuccessResponse)(res, 'Projects retrieved successfully', projects);
    }
    catch (error) {
        next(error);
    }
};
exports.getProjects = getProjects;
// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res, next) => {
    try {
        const project = await Project_1.default.findById(req.params.id)
            .populate('members', 'name email role avatar')
            .populate('createdBy', 'name email role avatar');
        if (!project) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Project not found', 404);
        }
        // Make sure user has access to this project
        if (req.user.role !== 'admin' &&
            req.user.role !== 'manager' &&
            !project.members.includes(req.user._id) &&
            project.createdBy.toString() !== req.user._id.toString()) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to access this project', 403);
        }
        (0, sendResponse_1.sendSuccessResponse)(res, 'Project retrieved successfully', project);
    }
    catch (error) {
        next(error);
    }
};
exports.getProject = getProject;
// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
    try {
        const { name, description, status, startDate, endDate, members } = req.body;
        // Create project
        const project = await Project_1.default.create({
            name,
            description,
            status,
            startDate,
            endDate,
            members: members || [],
            createdBy: req.user._id
        });
        const populatedProject = await Project_1.default.findById(project._id)
            .populate('members', 'name email role avatar')
            .populate('createdBy', 'name email role avatar');
        (0, sendResponse_1.sendSuccessResponse)(res, 'Project created successfully', populatedProject, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
    try {
        const { name, description, status, startDate, endDate, members } = req.body;
        let project = await Project_1.default.findById(req.params.id);
        if (!project) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Project not found', 404);
        }
        // Check if user is authorized to update the project
        if (req.user.role !== 'admin' &&
            req.user.role !== 'manager' &&
            project.createdBy.toString() !== req.user._id.toString()) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to update this project', 403);
        }
        project = await Project_1.default.findByIdAndUpdate(req.params.id, {
            name,
            description,
            status,
            startDate,
            endDate,
            members
        }, { new: true, runValidators: true })
            .populate('members', 'name email role avatar')
            .populate('createdBy', 'name email role avatar');
        (0, sendResponse_1.sendSuccessResponse)(res, 'Project updated successfully', project);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProject = updateProject;
// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (!project) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Project not found', 404);
        }
        // Check if user is authorized to delete the project
        if (req.user.role !== 'admin' &&
            req.user.role !== 'manager' &&
            project.createdBy.toString() !== req.user._id.toString()) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to delete this project', 403);
        }
        await project.deleteOne();
        (0, sendResponse_1.sendSuccessResponse)(res, 'Project deleted successfully', null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private
const addProjectMember = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Please provide a user ID', 400);
        }
        const project = await Project_1.default.findById(req.params.id);
        if (!project) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Project not found', 404);
        }
        // Check if user is authorized to update the project
        if (req.user.role !== 'admin' &&
            req.user.role !== 'manager' &&
            project.createdBy.toString() !== req.user._id.toString()) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to update this project', 403);
        }
        // Check if user is already a member
        if (project.members.includes(userId)) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'User is already a member of this project', 400);
        }
        project.members.push(userId);
        await project.save();
        const updatedProject = await Project_1.default.findById(req.params.id)
            .populate('members', 'name email role avatar')
            .populate('createdBy', 'name email role avatar');
        (0, sendResponse_1.sendSuccessResponse)(res, 'Member added to project successfully', updatedProject);
    }
    catch (error) {
        next(error);
    }
};
exports.addProjectMember = addProjectMember;
// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
const removeProjectMember = async (req, res, next) => {
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (!project) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Project not found', 404);
        }
        // Check if user is authorized to update the project
        if (req.user.role !== 'admin' &&
            req.user.role !== 'manager' &&
            project.createdBy.toString() !== req.user._id.toString()) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Not authorized to update this project', 403);
        }
        // Check if user is a member
        if (!project.members.includes(req.params.userId)) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'User is not a member of this project', 400);
        }
        // Remove member
        project.members = project.members.filter(member => member.toString() !== req.params.userId);
        await project.save();
        const updatedProject = await Project_1.default.findById(req.params.id)
            .populate('members', 'name email role avatar')
            .populate('createdBy', 'name email role avatar');
        (0, sendResponse_1.sendSuccessResponse)(res, 'Member removed from project successfully', updatedProject);
    }
    catch (error) {
        next(error);
    }
};
exports.removeProjectMember = removeProjectMember;
