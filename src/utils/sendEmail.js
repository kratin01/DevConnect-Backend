import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";

const createSendEmailCommand = (subject, htmlBody, textBody, toAddress) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: ["kratinaggarwal8750@gmail.com"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: htmlBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "kratin@devconnect.services",
  });
};

/**
 * Send an email using AWS SES
 */
const sendEmail = async (subject, htmlBody, textBody) => {
  const sendEmailCommand = createSendEmailCommand(subject, htmlBody, textBody);

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (error) {
    if (error instanceof Error && error.name === "MessageRejected") {
      return error;
    }
    throw error;
  }
};

export { sendEmail };
