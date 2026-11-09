"use client";

import { useActionState, useState } from "react";
import { Icon } from "@/components/icons";
import Turnstile from "@/components/Turnstile";
import { loginAction } from "@/lib/actions";
import { submitWithoutReset } from "@/lib/submitWithoutReset";
import type { LoginState } from "@/lib/types";

function Message({ state }: { state: LoginState }) {
  if (state?.error) {
    return (
      <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
        {state.error}
      </p>
    );
  }
  if (state?.notice) {
    return (
      <p role="status" className="rounded-md border border-gold bg-white px-4 py-3 text-sm text-ink">
        {state.notice}
      </p>
    );
  }
  return null;
}

/** @param emailCodes whether "Email me a code instead" can work (email sending is configured) */
export default function LoginForm({ emailCodes }: { emailCodes: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  if (state?.step === "code") {
    return (
      // Distinct keys: without them React reuses the email <input> for the code and keeps the typed email in it
      <form key="code" action={action} onSubmit={(e) => submitWithoutReset(e, action)} className="space-y-5">
        <div>
          <label htmlFor="code" className="label">6-digit code</label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\s*(\d\s*){6}"
            maxLength={9}
            required
            autoFocus
            className="field text-center text-2xl tracking-[0.3em] tabular-nums"
          />
          <p className="mt-1.5 text-sm text-slate">Open your authenticator app and enter the code shown for Elevate HQ.</p>
        </div>
        <Message state={state} />
        <button type="submit" name="intent" value="code" disabled={pending} className="btn btn-navy w-full disabled:opacity-60">
          {pending ? "Checking…" : "Verify"}
        </button>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          {emailCodes ? (
            <button
              type="submit"
              name="intent"
              value="email-code"
              formNoValidate
              disabled={pending}
              className="font-semibold text-navy underline decoration-brass underline-offset-4 hover:text-brass disabled:opacity-60"
            >
              Email me a code instead
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            name="intent"
            value="restart"
            formNoValidate
            disabled={pending}
            className="text-slate underline underline-offset-4 hover:text-navy disabled:opacity-60"
          >
            Start over
          </button>
        </div>
      </form>
    );
  }

  return (
    <form key="password" action={action} onSubmit={(e) => submitWithoutReset(e, action)} className="space-y-5">
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
      <Turnstile pending={pending} />
      <Message state={state} />
      <button type="submit" name="intent" value="password" disabled={pending} className="btn btn-navy w-full disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
