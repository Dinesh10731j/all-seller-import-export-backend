import { Request, Response, NextFunction } from "express";
export declare class VerifyToken {
    static authenticate(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=authentication.middleware.d.ts.map