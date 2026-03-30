import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

const client = twilio(accountSid, authToken);

export async function sendVerification(phone: string) {
  return client.verify.v2
    .services(verifyServiceSid)
    .verifications.create({ to: phone, channel: "sms" });
}

export async function checkVerification(phone: string, code: string) {
  return client.verify.v2
    .services(verifyServiceSid)
    .verificationChecks.create({ to: phone, code });
}

export { client as twilioClient };
