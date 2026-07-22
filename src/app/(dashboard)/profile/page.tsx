"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "@/lib/api/user";
import { isValidEmail, isValidPhone } from "@/lib/utils/validators";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSuccessMessage(null);
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (form.phone && !isValidPhone(form.phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSuccessMessage(null);
    setSubmitError(null);

    if (!validate()) return;

    try {
      setIsSaving(true);
      await updateProfile(form);
      setSuccessMessage("Your profile has been updated.");
    } catch (err) {
      setSubmitError("We couldn't save your changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-600">
          Manage your personal information and account settings.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border border-gray-200 p-6"
      >
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <Input
          label="Full Name"
          value={form.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          error={errors.fullName}
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />

        <Input
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900">Account</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/forgot-password")}
          >
            Change Password
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
