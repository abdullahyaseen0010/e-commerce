import type { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your VISAC account password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the email on your account and we&apos;ll send you a link to
          reset your password.
        </p>
      </div>

      <div className="mt-8">
        <ForgotPasswordForm />
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-gray-900 hover:underline">
          Back to sign in
        </Link>
      </p>
    </main>
  );
}
