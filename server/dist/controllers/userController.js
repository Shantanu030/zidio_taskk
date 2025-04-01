"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const sendResponse_1 = require("../utils/sendResponse");
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find();
        (0, sendResponse_1.sendSuccessResponse)(res, 'Users retrieved successfully', users);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'User not found', 404);
        }
        (0, sendResponse_1.sendSuccessResponse)(res, 'User retrieved successfully', user);
    }
    catch (error) {
        next(error);
    }
};
exports.getUser = getUser;
// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if email already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Email already in use', 400);
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            role,
        });
        (0, sendResponse_1.sendSuccessResponse)(res, 'User created successfully', user, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
    try {
        const { name, email, role } = req.body;
        const userId = req.params.id;
        // Check if email already exists (but not for this user)
        if (email) {
            const existingUser = await User_1.default.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return (0, sendResponse_1.sendErrorResponse)(res, 'Email already in use', 400);
            }
        }
        let user = await User_1.default.findById(userId);
        if (!user) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'User not found', 404);
        }
        user = await User_1.default.findByIdAndUpdate(userId, { name, email, role }, { new: true, runValidators: true });
        (0, sendResponse_1.sendSuccessResponse)(res, 'User updated successfully', user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'User not found', 404);
        }
        // Make sure user is not deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'You cannot delete your own account', 400);
        }
        await user.deleteOne();
        (0, sendResponse_1.sendSuccessResponse)(res, 'User deleted successfully', null);
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
// @desc    Upload user avatar
// @route   PUT /api/users/:id/avatar
// @access  Private/Admin
const uploadAvatar = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'User not found', 404);
        }
        // In a real app, you would process the uploaded file and save the URL
        // For now, we'll just use a generated avatar
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
        user.avatar = avatarUrl;
        await user.save();
        (0, sendResponse_1.sendSuccessResponse)(res, 'Avatar uploaded successfully', { avatar: user.avatar });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadAvatar = uploadAvatar;
