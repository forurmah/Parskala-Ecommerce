"use server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { hashPassword, verifyPassword } from "@/auth/password";
import { createSession, deleteSession } from "@/auth/session";
import {
  readAuthForm,
  safeRedirectPath,
  validateLogin,
  validateSignup,
  type AuthErrors,
} from "@/auth/validation";
import { db } from "@/db";
import { users } from "@/db/schema";

export type AuthFormState = {
  errors?: AuthErrors;
  message?: string;
  // Echoed back so the form keeps what the user typed (never the password).
  values?: { name: string; email: string };
};

// Used when the email doesn't exist, so a failed login takes about as
// long as a wrong password and doesn't reveal which emails are registered.
const dummyHash = hashPassword("dummy-password-for-timing");

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fields = readAuthForm(formData);
  const values = { name: fields.name, email: fields.email };

  const errors = validateSignup(fields);
  if (Object.keys(errors).length > 0) return { errors, values };

  const emailTaken = {
    errors: { email: "با این ایمیل قبلاً ثبت‌نام شده است." },
    values,
  };

  const existing = await db.query.users.findFirst({
    where: eq(users.email, fields.email),
    columns: { id: true },
  });
  if (existing) return emailTaken;

  let userId: string;
  try {
    const [user] = await db
      .insert(users)
      .values({
        name: fields.name,
        email: fields.email,
        passwordHash: await hashPassword(fields.password),
      })
      .returning({ id: users.id });
    userId = user.id;
  } catch (error) {
    // Two sign-ups with the same email at once: the unique index wins.
    if (String(error).includes("UNIQUE constraint failed")) return emailTaken;
    throw error;
  }

  await createSession(userId);
  redirect(safeRedirectPath(formData.get("next")));
}

export async function login(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const fields = readAuthForm(formData);
  const values = { name: "", email: fields.email };

  const errors = validateLogin(fields);
  if (Object.keys(errors).length > 0) return { errors, values };

  const user = await db.query.users.findFirst({
    where: eq(users.email, fields.email),
    columns: { id: true, passwordHash: true },
  });
  const passwordOk = await verifyPassword(
    fields.password,
    user?.passwordHash ?? (await dummyHash),
  );

  if (!user || !passwordOk) {
    return { message: "ایمیل یا رمز عبور اشتباه است.", values };
  }

  await createSession(user.id);
  redirect(safeRedirectPath(formData.get("next")));
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
