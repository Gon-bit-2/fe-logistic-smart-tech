import AuthScreen from "@/features/auth/presentation/screens/AuthScreen";
import ForgotPasswordForm from "@/features/auth/presentation/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthScreen variant="auth">
      <ForgotPasswordForm />
    </AuthScreen>
  );
}

