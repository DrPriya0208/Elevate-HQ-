"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      </div>
      {error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-navy w-full disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
