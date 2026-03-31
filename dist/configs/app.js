"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_routes_1 = __importDefault(require("../router/index.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const rate_limiting_1 = require("../middleware/rate_limiting");
const statusCode_interface_1 = require("../constant/statusCode.interface");
const message_interface_1 = require("../constant/message.interface");
const logger_1 = require("../util/logger");
const user_auto_tracking_1 = require("../middleware/user_auto_tracking");
const createApp = () => {
    const app = (0, express_1.default)();
    // Middlewares
    app.use((0, cookie_parser_1.default)());
    app.use(logger_1.httpLogger);
    const allowedOrigins = (process.env.CORS_ORIGINS || "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.length === 0) {
                const allowAllInDev = process.env.NODE_ENV !== "production";
                return callback(null, allowAllInDev);
            }
            if (allowedOrigins.includes(origin))
                return callback(null, true);
            return callback(new Error("CORS blocked"), false);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Captcha-Token"],
        exposedHeaders: ["Set-Cookie"],
        maxAge: 600,
    };
    app.use((0, cors_1.default)(corsOptions));
    app.use(rate_limiting_1.apiRateLimiter);
    app.use(user_auto_tracking_1.autoUserTracking);
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.get("/health", (_req, res) => res.status(statusCode_interface_1.HTTP_STATUS.OK).json({ status: message_interface_1.Message.HEALTH_OK }));
    app.use("/api/v1/all-seller-import-export", index_routes_1.default);
    return app;
};
exports.default = createApp;
//# sourceMappingURL=app.js.map