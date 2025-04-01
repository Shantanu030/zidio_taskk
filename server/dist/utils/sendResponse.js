"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
/**
 * Send success response
 * @param res - Express response object
 * @param message - Message to send
 * @param data - Data to send
 * @param statusCode - HTTP status code (default: 200)
 */
const sendSuccessResponse = (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
/**
 * Send error response
 * @param res - Express response object
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 400)
 */
const sendErrorResponse = (res, message, statusCode = 400) => {
    return res.status(statusCode).json({
        success: false,
        error: message,
    });
};
exports.sendErrorResponse = sendErrorResponse;
