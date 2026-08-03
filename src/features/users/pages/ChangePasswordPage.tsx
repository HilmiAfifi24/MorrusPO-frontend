import { useState } from "react";
import { useNavigate } from "react-router";
import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import InlineAlert from "../../../components/ui/InlineAlert";
import { useAuth } from "../../auth/hooks/useAuth";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { changePassword } from "../api/usersApi";
import { validateChangePasswordForm } from "../schemas/userSchema";
import type { ChangePasswordFormValues } from "../types/user";

const initialValues: ChangePasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const [values, setValues] = useState<ChangePasswordFormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordFormValues, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange<K extends keyof ChangePasswordFormValues>(
    key: K,
    value: ChangePasswordFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session?.userId) {
      return;
    }

    const nextErrors = validateChangePasswordForm(values);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword(session.userId, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      setSuccessMessage("Password berhasil diperbarui. Anda akan diminta login ulang.");
      setTimeout(() => {
        void logout();
        navigate("/signin", { replace: true });
      }, 1200);
    } catch (requestError) {
      const message =
        typeof requestError === "object" &&
        requestError &&
        "message" in requestError &&
        typeof requestError.message === "string"
          ? requestError.message
          : "Gagal memperbarui password.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedPageShell
      title="Ganti Password"
      description="Halaman ini dipakai untuk mengganti password akun Anda sendiri sesuai kontrak backend saat ini."
    >
      <InlineAlert tone="success" message={successMessage} />
      <ChangePasswordForm
        values={values}
        errors={errors}
        submitError={submitError}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </ProtectedPageShell>
  );
}
