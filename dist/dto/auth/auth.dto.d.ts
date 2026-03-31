/**
 * DTO for signing up a user
 */
export declare class SignUpDTO {
    name: string;
    email: string;
    password: string;
}
/**
 * DTO for signing in a user
 */
export declare class SignInDTO {
    email: string;
    password: string;
}
/**
 * DTO for forgot password
 */
export declare class ForgotPasswordDTO {
    email: string;
}
/**
 * DTO for reset password
 */
export declare class ResetPasswordDTO {
    email: string;
    token: string;
    password: string;
    confirmPassword: string;
}
//# sourceMappingURL=auth.dto.d.ts.map