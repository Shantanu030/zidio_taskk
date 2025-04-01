"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValidation = exports.projectValidation = exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.updatePasswordValidation = exports.updateDetailsValidation = exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
// User validation rules
exports.registerValidation = [
    (0, express_validator_1.check)('name', 'Name is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.check)('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];
exports.loginValidation = [
    (0, express_validator_1.check)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.check)('password', 'Password is required').exists(),
];
exports.updateDetailsValidation = [
    (0, express_validator_1.check)('name', 'Name is required').optional().not().isEmpty(),
    (0, express_validator_1.check)('email', 'Please include a valid email').optional().isEmail(),
];
exports.updatePasswordValidation = [
    (0, express_validator_1.check)('currentPassword', 'Current password is required').not().isEmpty(),
    (0, express_validator_1.check)('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
];
exports.forgotPasswordValidation = [
    (0, express_validator_1.check)('email', 'Please include a valid email').isEmail(),
];
exports.resetPasswordValidation = [
    (0, express_validator_1.check)('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
];
// Project validation rules
exports.projectValidation = [
    (0, express_validator_1.check)('name', 'Project name is required').not().isEmpty(),
    (0, express_validator_1.check)('description', 'Description is required').not().isEmpty(),
    (0, express_validator_1.check)('status', 'Status must be one of: active, completed, archived')
        .optional()
        .isIn(['active', 'completed', 'archived']),
    (0, express_validator_1.check)('startDate', 'Start date must be a valid date')
        .optional()
        .isISO8601(),
    (0, express_validator_1.check)('endDate', 'End date must be a valid date')
        .optional()
        .isISO8601(),
    (0, express_validator_1.check)('members', 'Members must be an array')
        .optional()
        .isArray(),
];
// Task validation rules
exports.taskValidation = [
    (0, express_validator_1.check)('title', 'Title is required').not().isEmpty(),
    (0, express_validator_1.check)('description', 'Description is required').not().isEmpty(),
    (0, express_validator_1.check)('status', 'Status must be one of: pending, in-progress, completed')
        .optional()
        .isIn(['pending', 'in-progress', 'completed']),
    (0, express_validator_1.check)('priority', 'Priority must be one of: low, medium, high')
        .optional()
        .isIn(['low', 'medium', 'high']),
    (0, express_validator_1.check)('dueDate', 'Due date must be a valid date')
        .optional()
        .isISO8601(),
];
