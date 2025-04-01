"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.resetPassword = exports.forgotPassword = exports.updatePassword = exports.updateDetails = exports.getMe = exports.login = exports.register = void 0;
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const sendResponse_1 = require("../utils/sendResponse");
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Email already registered', 400);
        }
        // Create the user
        const user = await User_1.default.create({
            name,
            email,
            password,
            role: role || 'employee', // Default to employee if no role provided
        });
        // Send token response
        sendTokenResponse(user, 201, res);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validate email and password
        if (!email || !password) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Please provide email and password', 400);
        }
        // Check for user
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Invalid credentials', 401);
        }
        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Invalid credentials', 401);
        }
        // Send token response
        sendTokenResponse(user, 200, res);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        // User is already available in req due to the protect middleware
        const user = req.user;
        (0, sendResponse_1.sendSuccessResponse)(res, 'Current user retrieved', user);
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user._id;
        // Check if email is already taken by another user
        if (email) {
            const emailExists = await User_1.default.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return (0, sendResponse_1.sendErrorResponse)(res, 'Email already in use', 400);
            }
        }
        // Update user
        const user = await User_1.default.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true });
        (0, sendResponse_1.sendSuccessResponse)(res, 'User details updated', user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateDetails = updateDetails;
// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;
        // Check if current password and new password are provided
        if (!currentPassword || !newPassword) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Please provide current password and new password', 400);
        }
        // Get user with password
        const user = await User_1.default.findById(userId).select('+password');
        if (!user) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'User not found', 404);
        }
        // Check if current password matches
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Current password is incorrect', 401);
        }
        // Update password
        user.password = newPassword;
        await user.save();
        (0, sendResponse_1.sendSuccessResponse)(res, 'Password updated', null);
    }
    catch (error) {
        next(error);
    }
};
exports.updatePassword = updatePassword;
// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        // Check if email is provided
        if (!email) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Please provide an email', 400);
        }
        // Find user with this email
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'No user found with that email', 404);
        }
        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        // In a real application, you would send an email with the reset URL
        // For now, we'll just return the token in the response
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
        (0, sendResponse_1.sendSuccessResponse)(res, 'Password reset email sent', { resetUrl, resetToken }, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.forgotPassword = forgotPassword;
// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const resetToken = req.params.resettoken;
        // Hash the reset token
        const resetPasswordToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        // Find user with this reset token and check if it's still valid
        const user = await User_1.default.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return (0, sendResponse_1.sendErrorResponse)(res, 'Invalid or expired token', 400);
        }
        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        // Send token response
        sendTokenResponse(user, 200, res);
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassword = resetPassword;
// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    (0, sendResponse_1.sendSuccessResponse)(res, 'User logged out successfully', null);
};
exports.logout = logout;
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };
    // Create user object without password
    const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
        success: true,
        token,
        user: userData,
    });
};
