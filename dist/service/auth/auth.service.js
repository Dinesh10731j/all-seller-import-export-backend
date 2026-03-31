"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const env_config_1 = require("../../configs/env.config");
const email_jobs_1 = require("../../jobs/email.jobs");
const email_functions_1 = require("../../function/email.functions");
const statusCode_interface_1 = require("../../constant/statusCode.interface");
// Destructure from envConfig with different variable names
const { ACCESS_TOKEN_SECRET: ENV_ACCESS_SECRET, REFRESH_TOKEN_SECRET: ENV_REFRESH_SECRET } = env_config_1.envConfig;
class AuthService {
    constructor(authRepo) {
        this.authRepo = authRepo;
        // Assign class properties safely
        this.accessTokenSecret = ENV_ACCESS_SECRET;
        if (!this.accessTokenSecret)
            throw new Error("ACCESS_TOKEN_SECRET not defined!");
        this.refreshTokenSecret = ENV_REFRESH_SECRET;
        if (!this.refreshTokenSecret)
            throw new Error("REFRESH_TOKEN_SECRET not defined!");
    }
    // Generate JWTs
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, isVerified: user.isVerified, name: user.name }, this.accessTokenSecret, { expiresIn: "15m" });
    }
    generateRefreshToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, isVerified: user.isVerified, name: user.name }, this.refreshTokenSecret, { expiresIn: "7d" });
    }
    // Signup
    async signup(dto) {
        const { email, password, name } = dto;
        const existingUser = await this.authRepo.findByEmail(email);
        if (existingUser)
            throw new Error("User already exists");
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await this.authRepo.createUser({
            name,
            email,
            password: hashedPassword,
        });
        const access_token = this.generateAccessToken(newUser);
        const refresh_token = this.generateRefreshToken(newUser);
        return { user: newUser, access_token, refresh_token };
    }
    // Signin
    async signin(dto) {
        const { email, password } = dto;
        const user = await this.authRepo.findByEmail(email);
        if (!user)
            throw new Error("Invalid credentials");
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            throw new Error("Invalid credentials");
        const access_token = this.generateAccessToken(user);
        const refresh_token = this.generateRefreshToken(user);
        return { user, access_token, refresh_token };
    }
    async forgotPassword(email) {
        const user = await this.authRepo.findByEmail(email);
        if (!user)
            return { status: statusCode_interface_1.HTTP_STATUS.NOT_FOUND };
        const rawToken = crypto_1.default.randomBytes(32).toString("hex");
        const hashedToken = crypto_1.default.createHash("sha256").update(rawToken).digest("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = expires;
        await this.authRepo.saveUser(user);
        const frontendUrl = env_config_1.envConfig.FRONTEND_URL || "http://localhost:3000";
        const resetLink = `${frontendUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
        await (0, email_jobs_1.enqueueEmail)((0, email_functions_1.buildResetPasswordEmailJob)({
            to: user.email,
            name: user.name,
            resetLink,
        }));
        return { status: statusCode_interface_1.HTTP_STATUS.OK };
    }
    async resetPassword(email, token, password) {
        const user = await this.authRepo.findByEmail(email);
        if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
            return { status: statusCode_interface_1.HTTP_STATUS.NOT_FOUND };
        }
        const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
        if (user.resetPasswordToken !== hashedToken) {
            return { status: statusCode_interface_1.HTTP_STATUS.BAD_REQUEST };
        }
        if (user.resetPasswordExpires.getTime() < Date.now()) {
            return { status: statusCode_interface_1.HTTP_STATUS.BAD_REQUEST };
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.authRepo.saveUser(user);
        return { status: statusCode_interface_1.HTTP_STATUS.OK };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map