import { Queue } from "bullmq";
import { redisConnection } from "./redis";
import { EmailJobData } from "../dto/interface";

export const emailQueue = new Queue<EmailJobData>("emailQueue", {
  connection: redisConnection,
});

