"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTransporter = exports.mailFrom = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = require("../configs/env.config");
const smtpHost = env_config_1.envConfig.SMTP_HOST;
const smtpPort = Number(env_config_1.envConfig.SMTP_PORT || "587");
const smtpUser = env_config_1.envConfig.SMTP_USER;
const smtpPass = env_config_1.envConfig.SMTP_PASS;
exports.mailFrom = smtpUser ? `"All Seller Import Export" <${smtpUser}>` : `"All Seller Import Export" <no-reply@example.com>`;
exports.mailTransporter = nodemailer_1.default.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    ...(smtpUser && smtpPass
        ? {
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        }
        : {}),
});
//# sourceMappingURL=mailer.js.map