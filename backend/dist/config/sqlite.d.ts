import Database from 'better-sqlite3';
declare class SQLiteDatabase {
    private db;
    private static instance;
    private constructor();
    static getInstance(): SQLiteDatabase;
    private initializeDatabase;
    getDatabase(): Database.Database;
    close(): void;
    isHealthy(): boolean;
}
export default SQLiteDatabase;
//# sourceMappingURL=sqlite.d.ts.map