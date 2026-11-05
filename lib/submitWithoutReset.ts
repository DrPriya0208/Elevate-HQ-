import { startTransition, type FormEvent } from "react";

/**
 * Submit a form through its server action without React 19's automatic form reset.
 *
 * With `<form action={formAction}>`, React clears every uncontrolled field once the action
 * finishes, even when it returns a validation error, so the visitor loses what they typed.
 * Calling this from `onSubmit` cancels the native submit (which also stops React's form-action
 * handling) and dispatches the same FormData in a transition, so `pending` from useActionState
 * still works and the fields keep their values. Keep `action={formAction}` on the form as well:
 * without JavaScript the browser still posts to the server action.
 */
export function submitWithoutReset(e: FormEvent<HTMLFormElement>, dispatch: (formData: FormData) => void) {
  e.preventDefault();
  const submitter = (e.nativeEvent as SubmitEvent).submitter ?? null;
  const formData = new FormData(e.currentTarget, submitter);
  startTransition(() => dispatch(formData));
}
