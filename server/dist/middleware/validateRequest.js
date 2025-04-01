"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
/**
 * Middleware to validate requests using express-validator
 * This runs after validation rules have been applied
 */
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: 'path' in err ? err.path : 'param' in err ? err.param : '',
                message: err.msg
            }))
        });
    }
    next();
};
exports.validateRequest = validateRequest;
