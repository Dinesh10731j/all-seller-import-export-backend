import { NextFunction, Request, Response } from "express";
import { Message } from "../constant/message.interface";
import { HTTP_STATUS } from "../constant/statusCode.interface";
import { UserPayload } from "../dto/interface";
import { singleTabGuardService } from "../service/session/single_tab_guard.service";

const resolveTabId = (req: Request): string | null => {
  const tabIdHeader = req.headers["x-tab-id"] ?? req.headers["x-browser-tab-id"];
  if (typeof tabIdHeader === "string") {
    const tabId = tabIdHeader.trim();
    if (tabId.length > 0) return tabId;
  }

  if (Array.isArray(tabIdHeader) && tabIdHeader.length > 0) {
    const first = String(tabIdHeader[0] || "").trim();
    if (first.length > 0) return first;
  }

  return null;
};

export class SingleTabGuard {
  static async enforce(req: Request, res: Response, next: NextFunction) {
    const user = (req as Request & { user?: UserPayload }).user;
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: Message.UNAUTHORIZED });
    }

    const tabId = resolveTabId(req);

    // Keep backward compatibility for clients that do not yet send X-Tab-Id.
    if (!tabId) return next();

    try {
      const result = await singleTabGuardService.assertSingleTab(user.id, tabId);
      if (!result.allowed) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          message: Message.MULTIPLE_TAB_NOT_ALLOWED,
        });
      }

      return next();
    } catch (error: unknown) {
      console.error("SingleTabGuard check failed:", error);
      return next();
    }
  }
}
