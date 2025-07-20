"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
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
    const defaultUsers = [
        {
            id: 1,
            email: 'admin@primeedge.com',
            password_hash: '$2a$10$SQpCjnC3Q8P6QyBOfcqBDORSF8Ei4buZU621HqCjEcXD0cDjUdzSq',
            first_name: 'System',
            last_name: 'Administrator',
            phone: '(555) 000-0000',
            account_type: 'personal',
            is_admin: true,
            is_active: true,
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            email: 'user@primeedge.com',
            password_hash: '$2a$10$4lSMDyivmM.qdtuqbabIAeYQUcxvHW3NoHsd1kf7BE4rvOvdI865e',
            first_name: 'John',
            last_name: 'Doe',
            phone: '(555) 123-4567',
            account_type: 'personal',
            is_admin: false,
            is_active: true,
            created_at: new Date().toISOString()
        },
        {
            id: 3,
            email: 'business@primeedge.com',
            password_hash: '$2a$10$R7eDV5boW5sLotfMZWp/FO99mSwBToXj2gVSQ57PgV1NRa3.L5hoi',
            first_name: 'Sarah',
            last_name: 'Johnson',
            phone: '(555) 987-6543',
            account_type: 'business',
            is_admin: false,
            is_active: true,
            created_at: new Date().toISOString()
        }
    ];
    return { users: defaultUsers, accounts: [], transactions: [], payees: [], adminLogs: [], sessions: [] };
}
router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe = false } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const db = loadDatabase();
        const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user || !user.is_active) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isAdmin: user.is_admin,
            accountType: user.account_type
        }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', { expiresIn: '7d' });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000,
            path: '/'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
            path: '/'
        });
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                isAdmin: user.is_admin,
                accountType: user.account_type
            },
            accessToken,
            refreshToken,
            expiresAt: Date.now() + (60 * 60 * 1000)
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});
router.get('/me', (req, res) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        else {
            token = req.cookies?.accessToken;
        }
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        const db = loadDatabase();
        const user = db.users.find((u) => u.id === decoded.id);
        if (!user || !user.is_active) {
            return res.status(401).json({ error: 'User not found' });
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
    }
    catch (error) {
        console.error('Auth check error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
});
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, dateOfBirth, address, city, state, zipCode, accountType = 'personal' } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                error: 'Email, password, first name, and last name are required'
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long'
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }
        const db = loadDatabase();
        const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
            return res.status(409).json({
                error: 'An account with this email already exists'
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = {
            id: Math.max(...db.users.map((u) => u.id), 0) + 1,
            email: email.toLowerCase(),
            password_hash: hashedPassword,
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            date_of_birth: dateOfBirth || null,
            address: address || null,
            city: city || null,
            state: state || null,
            zip_code: zipCode || null,
            account_type: accountType,
            is_admin: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        db.users.push(newUser);
        try {
            if (fs_1.default.existsSync(path_1.default.dirname(DB_PATH))) {
                fs_1.default.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
            }
        }
        catch (error) {
            console.log('Note: Could not save to persistent database (using in-memory)');
        }
        const accessToken = jsonwebtoken_1.default.sign({
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            isAdmin: newUser.is_admin,
            accountType: newUser.account_type
        }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_REFRESH_SECRET || 'refresh-secret', { expiresIn: '7d' });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000,
            path: '/'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.first_name,
                lastName: newUser.last_name,
                phone: newUser.phone,
                accountType: newUser.account_type,
                isAdmin: newUser.is_admin,
                createdAt: newUser.created_at
            },
            accessToken,
            expiresAt: Date.now() + (60 * 60 * 1000)
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            error: 'Registration failed. Please try again.'
        });
    }
});
router.post('/logout', (req, res) => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ success: true, message: 'Logged out successfully' });
});
exports.default = router;
//# sourceMappingURL=simple-auth.js.map