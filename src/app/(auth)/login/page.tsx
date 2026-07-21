import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your VISAC account.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to continue to your account.
        </p>
      </div>

      <div className="mt-8">
        <LoginForm />
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link
          href="/forgot-password"
          className="text-gray-500 hover:text-gray-700"
        >
          Forgot password?
        </Link>
        <p className="text-gray-500">
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-gray-900 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
