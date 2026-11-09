import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
import { checkAdminPassword, checkSecondStep, twoFactorEnabled } from "@/lib/twoFactor";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, ticket: {}, code: {} },
      async authorize(credentials) {
        // Second step: a ticket from a correct password plus an app or emailed code
        if (credentials?.ticket) return checkSecondStep(credentials.ticket, credentials.code);
        // Password alone signs in only while two-factor is switched off
        if (twoFactorEnabled()) return null;
        return checkAdminPassword(credentials?.email, credentials?.password);
      },
    }),
  ],
});
