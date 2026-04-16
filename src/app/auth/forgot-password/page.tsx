import AuthScreen from "@/features/auth/components/AuthScreen";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthScreen variant="auth">
      <ForgotPasswordForm />
    </AuthScreen>
  );
}
