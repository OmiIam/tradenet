import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const loginValidation: ValidationChain[];
export declare const registerValidation: ValidationChain[];
export declare const transferValidation: ValidationChain[];
export declare const accountValidation: ValidationChain[];
export declare const payeeValidation: ValidationChain[];
export declare const mongoIdValidation: (field: string) => ValidationChain[];
//# sourceMappingURL=validation.d.ts.map