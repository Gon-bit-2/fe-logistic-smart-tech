import AuthScreen from "@/features/auth/components/AuthScreen";
import OtpVerificationForm from "@/features/auth/components/OtpVerificationForm";

export default function OtpPage() {
  return (
    <AuthScreen variant="otp">
      <OtpVerificationForm />
    </AuthScreen>
  );
}
