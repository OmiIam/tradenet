"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const database_1 = __importDefault(require("../services/database"));
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/profile', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await database_1.default.getUserById(Number(req.user.id));
    if (!user) {
        throw new errorHandler_1.NotFoundError('User not found');
    }
    res.json({
        user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            accountType: user.account_type,
            isAdmin: user.is_admin,
            createdAt: user.created_at
        }
    });
}));
router.put('/profile', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { firstName, lastName, phone } = req.body;
    const updatedUser = await database_1.default.updateUser(Number(req.user.id), {
        first_name: firstName,
        last_name: lastName,
        phone,
        is_active: true
    });
    if (!updatedUser) {
        throw new errorHandler_1.NotFoundError('User not found');
    }
    res.json({
        success: true,
        user: {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            phone: updatedUser.phone,
            accountType: updatedUser.account_type,
            isAdmin: updatedUser.is_admin,
            createdAt: updatedUser.created_at
        }
    });
}));
exports.default = router;
//# sourceMappingURL=users.js.map