import { NextFunction, Request, Response } from "express";
export declare class SingleTabGuard {
    static enforce(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=single_tab_guard.d.ts.map