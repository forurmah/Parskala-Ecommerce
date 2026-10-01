import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { getCurrentUser } from "@/auth/session";
import { safeRedirectPath } from "@/auth/validation";

type AuthPageProps = {
  mode: "login" | "signup";
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AuthPage({ mode, searchParams }: AuthPageProps) {
  const next = safeRedirectPath((await searchParams).next);

  // Already logged in: nothing to do here.
  if (await getCurrentUser()) redirect(next);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h1 className="mb-6 text-2xl font-bold">
            {mode === "signup" ? "ساخت حساب کاربری" : "ورود به حساب"}
          </h1>
          <AuthForm mode={mode} next={next} />
        </div>
      </div>
    </main>
  );
}
