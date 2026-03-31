import { Request, Response, NextFunction } from "express";
export declare class CheckRole {
    static isVerifiedUser(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
    static isAdmin(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
    static isSudoAdmin(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
    static isAdminOrSudoAdmin(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
}
//# sourceMappingURL=check-role.d.ts.map