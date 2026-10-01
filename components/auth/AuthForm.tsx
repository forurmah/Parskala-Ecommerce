"use client";
import { useActionState } from "react";
import Link from "next/link";

import { login, signup, type AuthFormState } from "@/actions/auth";
import type { AuthErrors } from "@/auth/validation";

type AuthFormProps = {
  mode: "login" | "signup";
  // Where to go after success (validated again on the server).
  next: string;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 aria-invalid:border-red-500";

function Field({
  name,
  label,
  error,
  hint,
  ...inputProps
}: {
  name: keyof AuthErrors;
  label: string;
  error?: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `auth-${name}`;
  const messageId = `${id}-message`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={inputClass}
        {...inputProps}
      />
      {(error || hint) && (
        <p
          id={messageId}
          className={`mt-1.5 text-sm ${error ? "text-red-600" : "text-xs text-slate-500"}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export default function AuthForm({ mode, next }: AuthFormProps) {
  const isSignup = mode === "signup";
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    isSignup ? signup : login,
    {},
  );
  const otherModeHref = `${isSignup ? "/login" : "/signup"}?next=${encodeURIComponent(next)}`;

  return (
    <form action={formAction} noValidate className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {isSignup && (
        <Field
          name="name"
          label="نام"
          autoComplete="name"
          defaultValue={state.values?.name}
          error={state.errors?.name}
        />
      )}
      <Field
        name="email"
        label="ایمیل"
        type="email"
        dir="ltr"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={state.errors?.email}
      />
      <Field
        name="password"
        label="رمز عبور"
        type="password"
        dir="ltr"
        autoComplete={isSignup ? "new-password" : "current-password"}
        hint={isSignup ? "حداقل ۸ کاراکتر" : undefined}
        error={state.errors?.password}
      />

      {state.message && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-orange-600 px-5 py-3.5 font-bold text-white transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:bg-orange-400"
      >
        {pending ? "لطفاً صبر کنید…" : isSignup ? "ثبت‌نام" : "ورود"}
      </button>

      <p className="text-center text-sm text-slate-600">
        {isSignup ? "حساب کاربری دارید؟ " : "حساب کاربری ندارید؟ "}
        <Link href={otherModeHref} className="font-bold text-orange-600 hover:text-orange-700">
          {isSignup ? "وارد شوید" : "ثبت‌نام کنید"}
        </Link>
      </p>
    </form>
  );
}
