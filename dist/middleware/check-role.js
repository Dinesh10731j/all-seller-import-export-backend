"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckRole = void 0;
const statusCode_interface_1 = require("../constant/statusCode.interface");
const message_interface_1 = require("../constant/message.interface");
const forbidden = (res) => res.status(statusCode_interface_1.HTTP_STATUS.FORBIDDEN).json({ message: message_interface_1.Message.FORBIDDEN_ROLE });
class CheckRole {
    static isVerifiedUser(req, res, next) {
        const user = req.user;
        if (!user)
            return res.status(statusCode_interface_1.HTTP_STATUS.UNAUTHORIZED).json({ message: message_interface_1.Message.UNAUTHORIZED });
        if (!user.isVerified) {
            return res.status(statusCode_interface_1.HTTP_STATUS.FORBIDDEN).json({ message: message_interface_1.Message.FORBIDDEN });
        }
        return next();
    }
    static isAdmin(req, res, next) {
        const user = req.user;
        if (!user)
            return res.status(statusCode_interface_1.HTTP_STATUS.UNAUTHORIZED).json({ message: message_interface_1.Message.UNAUTHORIZED });
        if (user.role !== "admin" && user.role !== "sudo_admin") {
            return forbidden(res);
        }
        return next();
    }
    static isSudoAdmin(req, res, next) {
        const user = req.user;
        if (!user)
            return res.status(statusCode_interface_1.HTTP_STATUS.UNAUTHORIZED).json({ message: message_interface_1.Message.UNAUTHORIZED });
        if (user.role !== "sudo_admin") {
            return forbidden(res);
        }
        return next();
    }
    static isAdminOrSudoAdmin(req, res, next) {
        return CheckRole.isAdmin(req, res, next);
    }
}
exports.CheckRole = CheckRole;
//# sourceMappingURL=check-role.js.map