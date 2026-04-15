import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-container-low px-6 py-16">
      <div className="w-full max-w-xl">
        <LoginForm mode="login" />
      </div>
    </main>
  );
}
