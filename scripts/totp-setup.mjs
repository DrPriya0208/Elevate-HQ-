// One-time setup for the admin authenticator app.  Usage: npm run totp-setup
// Prints a new secret and saves a QR code to scan with Google Authenticator, Microsoft
// Authenticator or Authy. Running it again makes a NEW secret: the old app entry stops working.
import { writeFileSync } from "node:fs";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

const secret = new OTPAuth.Secret({ size: 20 });
const totp = new OTPAuth.TOTP({
  issuer: "Elevate HQ",
  label: "Admin",
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret,
});
const uri = totp.toString();
const file = "totp-setup-qr.png";

await QRCode.toFile(file, uri, { width: 480, margin: 2 });
console.log(await QRCode.toString(uri, { type: "terminal", small: true }));
console.log(`QR code also saved to ${file}. Scan it with the authenticator app.`);
console.log(`Can't scan? In the app choose "Enter a setup key": account "Elevate HQ", key ${secret.base32}, time based.\n`);
console.log("Then add this line to .env (and to Vercel's environment variables):\n");
console.log(`ADMIN_TOTP_SECRET="${secret.base32}"\n`);
console.log(`Delete ${file} after scanning: anyone with it can make sign-in codes.`);
