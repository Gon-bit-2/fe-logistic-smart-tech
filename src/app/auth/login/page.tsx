import AuthScreen from "@/features/auth/components/AuthScreen";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthScreen variant="auth">
        <LoginForm mode="login" />
    </AuthScreen>
  );
}
