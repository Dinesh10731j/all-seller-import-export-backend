"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueEmail = void 0;
const email_queue_1 = require("../queue/email.queue");
const enqueueEmail = async (data) => {
    return email_queue_1.emailQueue.add("sendEmail", data, {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: false,
        jobId: 'sendMail',
    });
};
exports.enqueueEmail = enqueueEmail;
//# sourceMappingURL=email.job.js.map