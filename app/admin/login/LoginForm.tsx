"use client";

import { useActionState, useState } from "react";
import { Icon } from "@/components/icons";
import { loginAction } from "@/lib/actions";
import { submitWithoutReset } from "@/lib/submitWithoutReset";

export default function LoginForm() {
  const [error, action, pending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} onSubmit={(e) => submitWithoutReset(e, action)} className="space-y-5">
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="field pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            aria-controls="password"
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-slate transition-colors hover:text-navy"
          >
            <Icon name={showPassword ? "eye-off" : "eye"} className="h-5 w-5" />
          </button>
        </div>
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
