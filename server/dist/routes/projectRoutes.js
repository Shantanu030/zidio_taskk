"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const auth_1 = require("../middleware/auth");
const validateRequest_1 = require("../middleware/validateRequest");
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
// Protect all routes
router.use(auth_1.protect);
// Project routes
router.route('/')
    .get(projectController_1.getProjects)
    .post(validators_1.projectValidation, validateRequest_1.validateRequest, projectController_1.createProject);
router.route('/:id')
    .get(projectController_1.getProject)
    .put(validators_1.projectValidation, validateRequest_1.validateRequest, projectController_1.updateProject)
    .delete(projectController_1.deleteProject);
// Project members routes
router.route('/:id/members')
    .put(projectController_1.addProjectMember);
router.route('/:id/members/:userId')
    .delete(projectController_1.removeProjectMember);
exports.default = router;
