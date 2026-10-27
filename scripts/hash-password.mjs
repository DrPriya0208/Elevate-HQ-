import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password || password.length < 10) {
  console.error('Usage: npm run hash -- "your-strong-password"   (minimum 10 characters)');
  process.exit(1);
}

// Base64 keeps the "$" characters in the bcrypt hash from being mangled by .env parsing.
const hash = bcrypt.hashSync(password, 12);
console.log("ADMIN_PASSWORD_HASH_B64=" + Buffer.from(hash).toString("base64"));
