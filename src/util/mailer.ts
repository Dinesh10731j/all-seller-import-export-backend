import nodemailer from "nodemailer";
import { envConfig } from "../configs/env.config";

const smtpHost = envConfig.SMTP_HOST;
const smtpPort = Number(envConfig.SMTP_PORT || "587");
const smtpUser = envConfig.SMTP_USER;
const smtpPass = envConfig.SMTP_PASS;

export const mailFrom =
  smtpUser ? `"All Seller Import Export" <${smtpUser}>` : `"All Seller Import Export" <no-reply@example.com>`;

export const mailTransporter = nodemailer.createTransport({
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

