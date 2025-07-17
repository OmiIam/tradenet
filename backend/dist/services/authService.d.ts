interface User {
    id: number;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone?: string;
    account_type: 'personal' | 'business';
    is_admin: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export declare const authService: {
    findUserByEmail(email: string): Promise<User | null>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
    generateAccessToken(user: User): string;
    generateRefreshToken(userId: number): string;
    verifyAccessToken(token: string): any;
    createUser(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
        accountType?: "personal" | "business";
    }): Promise<User>;
};
export {};
//# sourceMappingURL=authService.d.ts.map