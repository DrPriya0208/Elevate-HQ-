import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no bcrypt, no database). Used by the middleware.
export default {
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      if (path === "/admin/login") return true;
      if (path.startsWith("/admin")) return !!auth?.user;
      return true;
    },
  },
} satisfies NextAuthConfig;
