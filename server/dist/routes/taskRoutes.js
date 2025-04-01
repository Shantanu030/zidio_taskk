"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
// Protect all routes
router.use(auth_1.protect);
// Task routes
router.route('/')
    .get(taskController_1.getTasks)
    .post(validators_1.taskValidation, validateRequest_1.validateRequest, taskController_1.createTask);
router.route('/:id')
    .get(taskController_1.getTask)
    .put(validators_1.taskValidation, validateRequest_1.validateRequest, taskController_1.updateTask)
    .delete(taskController_1.deleteTask);
exports.default = router;
