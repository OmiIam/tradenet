"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("./logger");
const DB_PATH = path_1.default.join(__dirname, '../../database.sqlite');
const SCHEMA_PATH = path_1.default.join(__dirname, '../../../lib/database/schema.sql');
class SQLiteDatabase {
    constructor() {
        this.db = new better_sqlite3_1.default(DB_PATH);
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('foreign_keys = ON');
        this.initializeDatabase();
    }
    static getInstance() {
        if (!SQLiteDatabase.instance) {
            SQLiteDatabase.instance = new SQLiteDatabase();
        }
        return SQLiteDatabase.instance;
    }
    initializeDatabase() {
        try {
            if (fs_1.default.existsSync(SCHEMA_PATH)) {
                const schema = fs_1.default.readFileSync(SCHEMA_PATH, 'utf-8');
                this.db.exec(schema);
                logger_1.logger.info('Database schema initialized successfully');
            }
            else {
                logger_1.logger.error('Schema file not found at:', SCHEMA_PATH);
            }
        }
        catch (error) {
            logger_1.logger.error('Error initializing database:', error);
            throw error;
        }
    }
    getDatabase() {
        return this.db;
    }
    close() {
        this.db.close();
    }
    isHealthy() {
        try {
            const result = this.db.prepare('SELECT 1').get();
            return result !== undefined;
        }
        catch (error) {
            logger_1.logger.error('Database health check failed:', error);
            return false;
        }
    }
}
exports.default = SQLiteDatabase;
//# sourceMappingURL=sqlite.js.map