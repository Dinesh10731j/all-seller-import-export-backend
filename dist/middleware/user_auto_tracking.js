"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoUserTracking = void 0;
const analytics_repository_1 = require("../repository/analytics/analytics.repository");
const psqlDb_config_1 = require("../configs/psqlDb.config");
const autoUserTracking = (req, _res, next) => {
    req.headers["x-client-ip"] = req.ip;
    req.headers["x-user-agent"] = req.get("user-agent") || "";
    if (process.env.NODE_ENV !== "test" && process.env.ENABLE_ANALYTICS !== "false") {
        const isHealth = req.originalUrl === "/health";
        const isAuthRoute = req.originalUrl.startsWith("/api/v1/eagle-heli/auth");
        if (!isHealth && !isAuthRoute && psqlDb_config_1.AppDataSource.isInitialized) {
            const event = req.method === "GET" ? "page_view" : "api_call";
            const path = req.originalUrl || req.path;
            const referrer = req.get("referer") || req.get("referrer") || undefined;
            const userAgent = req.get("user-agent") || undefined;
            const ip = req.ip;
            setImmediate(async () => {
                try {
                    const payload = { event, path };
                    if (referrer)
                        payload.referrer = referrer;
                    if (userAgent)
                        payload.userAgent = userAgent;
                    if (ip)
                        payload.ip = ip;
                    const analyticsRepo = new analytics_repository_1.AnalyticsRepository();
                    await analyticsRepo.createAnalytics(payload);
                }
                catch {
                    // swallow analytics errors to avoid impacting requests
                }
            });
        }
    }
    next();
};
exports.autoUserTracking = autoUserTracking;
//# sourceMappingURL=user_auto_tracking.js.map