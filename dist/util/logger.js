"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const chalk_1 = __importDefault(require("chalk"));
morgan_1.default.token("statusColor", (_req, res) => {
    const status = res.statusCode;
    if (status >= 500)
        return chalk_1.default.red(status.toString());
    if (status >= 400)
        return chalk_1.default.yellow(status.toString());
    if (status >= 300)
        return chalk_1.default.cyan(status.toString());
    return chalk_1.default.green(status.toString());
});
morgan_1.default.token("responseTime", (_req, res) => {
    const time = res.getHeader("x-response-time");
    return typeof time === "string" ? time : "-";
});
exports.httpLogger = (0, morgan_1.default)(":method :url :statusColor :res[content-length] - :response-time ms", {
    skip: (_req) => process.env.NODE_ENV === "test",
});
//# sourceMappingURL=logger.js.map