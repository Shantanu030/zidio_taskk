"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
// Public routes
router.post('/register', validators_1.registerValidation, validateRequest_1.validateRequest, authController_1.register);
router.post('/login', validators_1.loginValidation, validateRequest_1.validateRequest, authController_1.login);
router.post('/forgotpassword', validators_1.forgotPasswordValidation, validateRequest_1.validateRequest, authController_1.forgotPassword);
router.put('/resetpassword/:resettoken', validators_1.resetPasswordValidation, validateRequest_1.validateRequest, authController_1.resetPassword);
router.get('/logout', authController_1.logout);
// Protected routes
router.use(auth_1.protect);
router.get('/me', authController_1.getMe);
router.put('/updatedetails', validators_1.updateDetailsValidation, validateRequest_1.validateRequest, authController_1.updateDetails);
router.put('/updatepassword', validators_1.updatePasswordValidation, validateRequest_1.validateRequest, authController_1.updatePassword);
exports.default = router;
