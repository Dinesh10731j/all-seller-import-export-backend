"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../../service/auth/auth.service");
const auth_repository_1 = require("../../repository/auth/auth.repository");
const auth_dto_1 = require("../../dto/auth/auth.dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const statusCode_interface_1 = require("../../constant/statusCode.interface");
const message_interface_1 = require("../../constant/message.interface");
// Initialize AuthService
const authRepo = new auth_repository_1.AuthRepository();
const authService = new auth_service_1.AuthService(authRepo);
class AuthController {
    static async signup(req, res) {
        try {
            const dto = (0, class_transformer_1.plainToInstance)(auth_dto_1.SignUpDTO, req.body);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0)
                return res.status(statusCode_interface_1.HTTP_STATUS.BAD_REQUEST).json(errors);
            // Call your AuthService to create user and get tokens
            const { user, access_token, refresh_token } = await authService.signup(dto);
            // Set cookies
            res
                .cookie("access_token", access_token, {
                httpOnly: true,
                secure: true, // use true in production (HTTPS)
                sameSite: "strict",
                maxAge: 15 * 60 * 1000, // 15 minutes
            })
                .cookie("refresh_token", refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
                .status(statusCode_interface_1.HTTP_STATUS.CREATED)
                .json({ message: message_interface_1.Message.USER_CREATED_SUCCESS, user });
        }
        catch (err) {
            const msg = err?.message === message_interface_1.Message.USER_ALREADY_EXISTS ? message_interface_1.Message.USER_ALREADY_EXISTS : message_interface_1.Message.INVALID_REQUEST;
            return res.status(statusCode_interface_1.HTTP_STATUS.BAD_REQUEST).json({ message: msg });
        }
    }
    static async signin(req, res) {
        try {
            const dto = (0, class_transformer_1.plainToInstance)(auth_dto_1.SignInDTO, req.body);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0)
                return res.status(statusCode_interface_1.HTTP_STATUS.BAD_REQUEST).json(errors);
            // Calling   AuthService to validate user and get tokens
            const { access_token, refresh_token } = await authService.signin(dto);
            // Set cookies
            res
                .cookie("access_token", access_token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000, // 15 minutes
            })
                .cookie("refresh_token", refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
                .status(statusCode_interface_1.HTTP_STATUS.OK)
                .json({ message: message_interface_1.Message.LOGIN_SUCCESS });
        }
        catch (err) {
            return res.status(statusCode_interface_1.HTTP_STATUS.BAD_REQUEST).json({ message: message_interface_1.Message.INVALID_EMAIL_OR_PASSWORD });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const dto = (0, class_transformer_1.plainToInstance)(auth_dto_1.ForgotPasswordDTO, req.body);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0)
                return res.status(statusCode_interface_1.HTTP_STATUS.BAD_REQUEST).json(errors);
            const result = await authService.forgotPassword(dto.email);
            if (result.status === statusCode_interface_1.HTTP_STATUS.NOT_FOUND) {
                return res.status(result.status).json({ message: message_interface_1.Message.USER_NOT_FOUND });
            }
            if (result.status !== statusCode_interface_1.HTTP_STATUS.OK) {
                return res.status(result.status).json({ message: message_interface_1.Message.INTERNAL_SERVER_ERROR });
            }
            return res.status(result.status).json({ message: message_interface_1.Message.RESET_EMAIL_SENT });
        }
        catch (err) {
            return res.status(statusCode_interface_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: message_interface_1.Message.INTERNAL_SERVER_ERROR });
        }
    }
    static async resetPassword(req, res) {
        try {
            const dto = (0, class_transformer_1.plainToInstance)(auth_dto_1.ResetPasswordDTO, req.body);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0)
                return res.status(statusCode_interface_1.HTTP_STATUS.BAD_REQUEST).json(errors);
            if (dto.password !== dto.confirmPassword) {
                return res.status(statusCode_interface_1.HTTP_STATUS.BAD_REQUEST).json({ message: message_interface_1.Message.INVALID_REQUEST });
            }
            const result = await authService.resetPassword(dto.email, dto.token, dto.password);
            if (result.status === statusCode_interface_1.HTTP_STATUS.NOT_FOUND) {
                return res.status(result.status).json({ message: message_interface_1.Message.USER_NOT_FOUND });
            }
            if (result.status === statusCode_interface_1.HTTP_STATUS.BAD_REQUEST) {
                return res.status(result.status).json({ message: message_interface_1.Message.RESET_TOKEN_INVALID });
            }
            if (result.status !== statusCode_interface_1.HTTP_STATUS.OK) {
                return res.status(result.status).json({ message: message_interface_1.Message.INTERNAL_SERVER_ERROR });
            }
            return res.status(result.status).json({ message: message_interface_1.Message.PASSWORD_RESET_SUCCESS });
        }
        catch (err) {
            return res.status(statusCode_interface_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: message_interface_1.Message.INTERNAL_SERVER_ERROR });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map