import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const OAuth2 = google.auth.OAuth2;

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = "https://developers.google.com/oauthplayground";
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);
oauth2Client.setCredentials({ refresh_token: refreshToken });

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html: string
) {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cloudyversedz@gmail.com",
        clientId,
        clientSecret,
        refreshToken,
        accessToken: accessToken.token,
      },
    } as SMTPTransport.Options);

    const mailOptions = {
      from: "cloudyversedz@gmail.com",
      to,
      subject,
      text,
      html,
    };

    const result = await transport.sendMail(mailOptions);

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
