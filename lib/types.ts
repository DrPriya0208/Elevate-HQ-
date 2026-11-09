/** Admin sign-in: which screen to show (password, or the 6-digit code), plus any message. */
export type LoginState = { step?: "password" | "code"; error?: string; notice?: string } | undefined;
export type FormState = { error?: string } | undefined;
export type ContactState = { ok?: boolean; error?: string } | undefined;
export type ReviewState = { ok?: boolean; error?: string } | undefined;
