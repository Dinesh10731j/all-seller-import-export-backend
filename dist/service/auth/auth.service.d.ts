import { AuthRepository } from "../../repository/auth/auth.repository";
import { User } from "../../entities/user.entity";
import { SignInDTO, SignUpDTO } from "../../dto/auth/auth.dto";
import { ServiceResult } from "../../types/service_result";
export declare class AuthService {
    private authRepo;
    private accessTokenSecret;
    private refreshTokenSecret;
    constructor(authRepo: AuthRepository);
    private generateAccessToken;
    private generateRefreshToken;
    signup(dto: SignUpDTO): Promise<{
        user: User;
        access_token: string;
        refresh_token: string;
    }>;
    signin(dto: SignInDTO): Promise<{
        user: User;
        access_token: string;
        refresh_token: string;
    }>;
    forgotPassword(email: string): Promise<ServiceResult<null>>;
    resetPassword(email: string, token: string, password: string): Promise<ServiceResult<null>>;
}
//# sourceMappingURL=auth.service.d.ts.map