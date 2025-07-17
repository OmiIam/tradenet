"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(process.cwd(), '..', 'data.json');
function loadDatabase() {
    try {
        if (fs_1.default.existsSync(DB_PATH)) {
            const data = fs_1.default.readFileSync(DB_PATH, 'utf-8');
            return JSON.parse(data);
        }
    }
    catch (error) {
        console.error('Error loading database:', error);
    }
    return {
        users: [],
        accounts: [],
        transactions: [],
        payees: [],
        adminLogs: [],
        sessions: []
    };
}
function saveDatabase(db) {
    try {
        fs_1.default.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    }
    catch (error) {
        console.error('Error saving database:', error);
    }
}
exports.authService = {
    async findUserByEmail(email) {
        const db = loadDatabase();
        return db.users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    },
    async comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    },
    async hashPassword(password) {
        return bcryptjs_1.default.hash(password, 12);
    },
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isAdmin: user.is_admin,
            accountType: user.account_type
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '1h' });
    },
    generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
    },
    verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (error) {
            return null;
        }
    },
    async createUser(userData) {
        const db = loadDatabase();
        const passwordHash = await this.hashPassword(userData.password);
        const newUser = {
            id: Math.max(...db.users.map(u => u.id), 0) + 1,
            email: userData.email.toLowerCase(),
            password_hash: passwordHash,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            account_type: userData.accountType || 'personal',
            is_admin: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        db.users.push(newUser);
        saveDatabase(db);
        return newUser;
    }
};
//# sourceMappingURL=authService.js.map