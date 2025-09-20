import dotenv from "dotenv";
import Twilio from "twilio";

dotenv.config(); 

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  throw new Error("Twilio credentials are missing! Please check your .env file.");
}

const client = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Format Indian number
export const formatIndianNumber = (number) => {
  if (!number) return null;
  number = number.replace(/\D/g, ""); 
  if (number.length === 10) return `+91${number}`;
  if (number.startsWith("91") && number.length === 12) return `+${number}`;
  if (number.startsWith("+")) return number;
  throw new Error("Invalid phone number format");
};

// Send SMS
export const sendSMS = async (to, message) => {
  try {
    if (!to || !message) throw new Error("'to' and 'message' are required");
    const formattedTo = formatIndianNumber(to);

    console.log("📨 Trying to send SMS", { from: TWILIO_PHONE_NUMBER, to: formattedTo, message });

    const msg = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formattedTo,
    });

    console.log(`✅ SMS sent to ${formattedTo}, SID: ${msg.sid}, Status: ${msg.status}`);
    return msg;
  } catch (error) {
    console.error("❌ Twilio SMS error:", error);
    throw error;
  }
};


export const makeVoiceCall = async (to, twimlUrl) => {
  try {
    if (!to || !twimlUrl) throw new Error("'to' and 'twimlUrl' are required");
    const formattedTo = formatIndianNumber(to);

    console.log("📞 Initiating Voice Call", { from: TWILIO_PHONE_NUMBER, to: formattedTo, url: twimlUrl });

    const call = await client.calls.create({
      to: formattedTo,
      from: TWILIO_PHONE_NUMBER,
      url: twimlUrl, // This should point to your TwiML endpoint
    });

    console.log(`✅ Call initiated to ${formattedTo}, SID: ${call.sid}`);
    return call;
  } catch (error) {
    console.error("❌ Twilio Call error:", error);
    throw error;
  }
};

export default client;
