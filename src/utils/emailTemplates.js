import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAcceptedRequestTemplate = async (fromUser, loggedInUser) => {
  try {
    const htmlPath = path.resolve(
      __dirname,
      "acceptedRequest.html" // Corrected path
    );
    let template = await fs.readFile(htmlPath, "utf-8");

    // Replace placeholders with dynamic data
    template = template.replace(/{{from_user_firstName}}/g, fromUser.firstName);
    template = template.replace(
      /{{loggedInUser_firstName}}/g,
      loggedInUser.firstName
    );
    template = template.replace(/{{app_url}}/g, "https://devconnect.services");

    return template;
  } catch (error) {
    console.error("Error loading email template:", error);
    return null;
  }
};