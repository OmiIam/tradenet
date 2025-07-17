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
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const payees = await database_1.default.getPayeesByUserId(Number(req.user.id));
    res.json({
        payees: payees.map(payee => ({
            id: payee.id,
            name: payee.name,
            accountNumber: payee.account_number,
            routingNumber: payee.routing_number,
            bankName: payee.bank_name,
            payeeType: payee.payee_type,
            phone: payee.phone,
            email: payee.email,
            memo: payee.memo,
            isVerified: payee.is_verified,
            isActive: payee.is_active,
            createdAt: payee.created_at
        }))
    });
}));
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const payeeId = parseInt(req.params.id || '0');
    const payee = await database_1.default.getPayeeById(payeeId);
    if (!payee || payee.user_id !== Number(req.user.id)) {
        throw new errorHandler_1.NotFoundError('Payee not found');
    }
    res.json({
        payee: {
            id: payee.id,
            name: payee.name,
            accountNumber: payee.account_number,
            routingNumber: payee.routing_number,
            bankName: payee.bank_name,
            payeeType: payee.payee_type,
            phone: payee.phone,
            email: payee.email,
            memo: payee.memo,
            isVerified: payee.is_verified,
            isActive: payee.is_active,
            createdAt: payee.created_at
        }
    });
}));
router.post('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, accountNumber, routingNumber, bankName, payeeType, phone, email, memo } = req.body;
    const payee = await database_1.default.createPayee({
        user_id: Number(req.user.id),
        name,
        account_number: accountNumber,
        routing_number: routingNumber,
        bank_name: bankName,
        payee_type: payeeType || 'person',
        phone,
        email,
        memo
    });
    res.status(201).json({
        success: true,
        payee: {
            id: payee.id,
            name: payee.name,
            accountNumber: payee.account_number,
            routingNumber: payee.routing_number,
            bankName: payee.bank_name,
            payeeType: payee.payee_type,
            phone: payee.phone,
            email: payee.email,
            memo: payee.memo,
            isVerified: payee.is_verified,
            isActive: payee.is_active,
            createdAt: payee.created_at
        }
    });
}));
exports.default = router;
//# sourceMappingURL=payees.js.map