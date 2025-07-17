import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { logger } from './logger';

const DB_PATH = path.join(__dirname, '../../database.sqlite');
const SCHEMA_PATH = path.join(__dirname, '../../../lib/database/schema.sql');

class SQLiteDatabase {
  private db: Database.Database;
  private static instance: SQLiteDatabase;

  private constructor() {
    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.initializeDatabase();
  }

  public static getInstance(): SQLiteDatabase {
    if (!SQLiteDatabase.instance) {
      SQLiteDatabase.instance = new SQLiteDatabase();
    }
    return SQLiteDatabase.instance;
  }

  private initializeDatabase(): void {
    try {
      if (fs.existsSync(SCHEMA_PATH)) {
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
        this.db.exec(schema);
        logger.info('Database schema initialized successfully');
      } else {
        logger.error('Schema file not found at:', SCHEMA_PATH);
      }
    } catch (error) {
      logger.error('Error initializing database:', error);
      throw error;
    }
  }

  public getDatabase(): Database.Database {
    return this.db;
  }

  public close(): void {
    this.db.close();
  }

  // Health check method
  public isHealthy(): boolean {
    try {
      const result = this.db.prepare('SELECT 1').get();
      return result !== undefined;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }
}

export default SQLiteDatabase;