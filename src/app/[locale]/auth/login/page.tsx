import AuthScreen from "@/features/auth/presentation/screens/AuthScreen";
import LoginForm from "@/features/auth/presentation/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthScreen variant="auth">
        <LoginForm mode="login" />
    </AuthScreen>
  );
}

