import { EmailJobData } from "../dto/interface";
import { emailQueue } from "../queue/email.queue";

export const enqueueEmail = async (data: EmailJobData) => {
  return emailQueue.add("sendEmail", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false,
    jobId:'sendMail',
    
  });
};

