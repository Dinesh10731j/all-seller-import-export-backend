"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleTabGuard = void 0;
const message_interface_1 = require("../constant/message.interface");
const statusCode_interface_1 = require("../constant/statusCode.interface");
const single_tab_guard_service_1 = require("../service/session/single_tab_guard.service");
const resolveTabId = (req) => {
    const tabIdHeader = req.headers["x-tab-id"] ?? req.headers["x-browser-tab-id"];
    if (typeof tabIdHeader === "string") {
        const tabId = tabIdHeader.trim();
        if (tabId.length > 0)
            return tabId;
    }
    if (Array.isArray(tabIdHeader) && tabIdHeader.length > 0) {
        const first = String(tabIdHeader[0] || "").trim();
        if (first.length > 0)
            return first;
    }
    return null;
};
class SingleTabGuard {
    static async enforce(req, res, next) {
        const user = req.user;
        if (!user) {
            return res.status(statusCode_interface_1.HTTP_STATUS.UNAUTHORIZED).json({ message: message_interface_1.Message.UNAUTHORIZED });
        }
        const tabId = resolveTabId(req);
        // Keep backward compatibility for clients that do not yet send X-Tab-Id.
        if (!tabId)
            return next();
        try {
            const result = await single_tab_guard_service_1.singleTabGuardService.assertSingleTab(user.id, tabId);
            if (!result.allowed) {
                return res.status(statusCode_interface_1.HTTP_STATUS.CONFLICT).json({
                    message: message_interface_1.Message.MULTIPLE_TAB_NOT_ALLOWED,
                });
            }
            return next();
        }
        catch (error) {
            console.error("SingleTabGuard check failed:", error);
            return next();
        }
    }
}
exports.SingleTabGuard = SingleTabGuard;
//# sourceMappingURL=single_tab_guard.js.map