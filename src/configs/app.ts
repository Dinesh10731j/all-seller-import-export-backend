import express, { Application } from "express";
import router from "../router/index.routes";
import cookieParser from "cookie-parser"
import cors, { CorsOptions } from "cors";
import { apiRateLimiter } from "../middleware/rate_limiting";
import { HTTP_STATUS } from "../constant/statusCode.interface";
import { Message } from "../constant/message.interface";
import { httpLogger } from "../util/logger";
import { autoUserTracking } from "../middleware/user_auto_tracking";
const createApp = (): Application => {
  const app = express();
  // Middlewares
  app.use(cookieParser())
  app.use(httpLogger);

  const allowedOrigins = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        const allowAllInDev = process.env.NODE_ENV !== "production";
        return callback(null, allowAllInDev);
      }
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Captcha-Token"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 600,
  };

  app.use(cors(corsOptions));
  app.use(apiRateLimiter);
  app.use(autoUserTracking);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => res.status(HTTP_STATUS.OK).json({ status: Message.HEALTH_OK }));
  app.use("/api/v1/all-seller-import-export",router);

  return app;
};

export default createApp;
