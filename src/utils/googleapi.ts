import {google} from "googleapis";
import env from "#config/env/env.js";
import { AuthClient } from "google-auth-library";
import fs from "node:fs";
const auth = new google.auth.GoogleAuth({
  keyFile: env.GOOGLE_APPLICATION_CREDENTIALS, // Json service account
  scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Provide sheets 
});

const client = await auth.getClient();

export default client;