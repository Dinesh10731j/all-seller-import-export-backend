"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../configs/env.config");
const statusCode_interface_1 = require("../constant/statusCode.interface");
const message_interface_1 = require("../constant/message.interface");
const psqlDb_config_1 = require("../configs/psqlDb.config");
const user_entity_1 = require("../entities/user.entity");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = env_config_1.envConfig;
class VerifyToken {
    static async authenticate(req, res, next) {
        try {
            const token = req.cookies?.access_token || req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                const refreshToken = req.cookies?.refresh_token;
                if (!refreshToken) {
                    return res.status(statusCode_interface_1.HTTP_STATUS.UNAUTHORIZED).json({ message: message_interface_1.Message.ACCESS_TOKEN_MISSING });
                }
                const refreshDecoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
                if (typeof refreshDecoded !== "object" ||
                    refreshDecoded === null ||
                    !("id" in refreshDecoded)) {
                    return res.status(statusCode_interface_1.HTTP_STATUS.UNAUTHORIZED).json({ message: message_interface_1.Message.INVALID_OR_EXPIRED_TOKEN });
                }
                const userRepo = psqlDb_config_1.AppDataSource.getRepository(user_entity_1.User);
                const user = await userRepo.findOne({ where: { id: Number(refreshDecoded.id) } });
                if (!user) {
                    return res.status(statusCode_interface_1.HTTP_STATUS.UNAUTHORIZED).json({ message: message_interface_1.Message.INVALID_OR_EXPIRED_TOKEN });
                }
                const accessToken = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    name: user.name,
                }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
                res.cookie("access_token", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000,
                });
                req.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified,
                    name: user.name,
                };
                return next();
            }
            // jwt.verify returns string | object, so we need type guard
            const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
            if (typeof decoded !== "object" ||
                decoded === null ||
                !("id" in decoded) ||
                !("email" in decoded) ||
                !("role" in decoded) ||
                !("isVerified" in decoded) ||
                !("name" in decoded)) {
                return res.status(statusCode_interface_1.HTTP_STATUS.UNAUTHORIZED).json({ message: message_interface_1.Message.INVALID_TOKEN_PAYLOAD });
            }
            // TypeScript now knows decoded has id & email
            req.user = decoded;
            next();
        }
        catch (err) {
            return res.status(statusCode_interface_1.HTTP_STATUS.UNAUTHORIZED).json({ message: message_interface_1.Message.INVALID_OR_EXPIRED_TOKEN });
        }
    }
}
exports.VerifyToken = VerifyToken;
//# sourceMappingURL=authentication.middleware.js.map