"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protect all routes
router.use(auth_1.protect);
// Admin only routes
router.use((0, auth_1.authorize)('admin'));
router.route('/')
    .get(userController_1.getUsers)
    .post(userController_1.createUser);
router.route('/:id')
    .get(userController_1.getUser)
    .put(userController_1.updateUser)
    .delete(userController_1.deleteUser);
router.put('/:id/avatar', userController_1.uploadAvatar);
exports.default = router;
