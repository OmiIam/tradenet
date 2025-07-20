import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
    code?: string;
}
export declare class ValidationError extends Error {
    statusCode: number;
    isOperational: boolean;
    code: string;
    constructor(message: string);
}
export declare class AuthenticationError extends Error {
    statusCode: number;
    isOperational: boolean;
    code: string;
    constructor(message?: string);
}
export declare class ForbiddenError extends Error {
    statusCode: number;
    isOperational: boolean;
    code: string;
    constructor(message?: string);
}
export declare class AuthorizationError extends Error {
    statusCode: number;
    isOperational: boolean;
    code: string;
    constructor(message?: string);
}
export declare class NotFoundError extends Error {
    statusCode: number;
    isOperational: boolean;
    code: string;
    constructor(message?: string);
}
export declare class ConflictError extends Error {
    statusCode: number;
    isOperational: boolean;
    code: string;
    constructor(message: string);
}
export declare class InternalServerError extends Error {
    statusCode: number;
    isOperational: boolean;
    code: string;
    constructor(message?: string);
}
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const globalErrorHandler: ErrorRequestHandler;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map