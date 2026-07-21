import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new VISAC account.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Join VISAC to track orders, save favorites, and check out faster.
        </p>
      </div>

      <div className="mt-8">
        <RegisterForm />
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-gray-900 hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
