import { Request, Response } from "express";
export declare class AuthController {
    static signup(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static signin(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=auth.controller.d.ts.map