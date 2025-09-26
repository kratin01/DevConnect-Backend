import * as cron from "node-cron";
import connectionRequest from "../models/connectionRequest.js";
import { subDays, startOfDay, endOfDay } from "date-fns";
import { sendEmail } from "./sendEmail.js";

//we schedule a job to run every day at 8 AM which basically sends the email to all users who have pending requests older than 24 hours
cron.schedule("0 8 * * *", async () => {
  const yesterday = subDays(new Date(), 0);
  const start = startOfDay(yesterday);
  const end = endOfDay(yesterday);
  try {
    //if we have million of requests then we can use pagination here to fetch requests in batches
    const requests = await connectionRequest
      .find({
        status: "interested",
        createdAt: { $gte: start, $lte: end },
      })
      .populate("fromUserId toUserId");
    console.log(requests);
    const listofEmails = [
      ...new Set(requests.map((req) => req.toUserId.email)),
    ];

    // Here the logic to send emails to users based on the fetched requests
    //but this is not a good way of sending mails because if we have 1000s of mails to send then it will take a lot of time to send all mails and since it's a synchronous process it will block the event loop
    //so we can use some job queues like bull or bee-queue to handle this kind of situation
    for (const email of listofEmails) {
      try {
        // in sendEmail function we send subject, htmlBody, textBody
        const mailssent = await sendEmail(
          "Pending Connection Requests Reminder",
          `<p>Dear User,${email}</p>
        <p>This is a gentle reminder that you have pending connection requests on DevConnect that are older than 24 hours. Please take a moment to review and respond to these requests.</p>
        <p>Thank you for being a valued member of our community!</p>
        <p>Best regards,<br/>The DevConnect Team</p>`,
          `Dear User,
        This is a gentle reminder that you have pending connection requests on DevConnect that are older than 24 hours. Please take a moment to review and respond to these requests.
        Thank you for being a valued member of our community!
        Best regards,
        The DevConnect Team`
        );
        // console.log("Mails sent", mailssent);
      } catch (error) {
        console.error("Error sending emails:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching pending requests:", error);
  }
});
