import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64;
        if (!adminEmail || !hashB64 || email !== adminEmail) return null;

        const hash = Buffer.from(hashB64, "base64").toString("utf8");
        const ok = await bcrypt.compare(password, hash);
        return ok ? { id: "admin", email: adminEmail, name: "Admin" } : null;
      },
    }),
  ],
});
