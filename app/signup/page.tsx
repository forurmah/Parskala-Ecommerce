import type { Metadata } from "next";
import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "ثبت‌نام | پارس‌کالا",
};

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <AuthPage mode="signup" searchParams={searchParams} />;
}
