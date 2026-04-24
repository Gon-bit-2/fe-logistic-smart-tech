export const authHeroPanelContent = {
  auth: {
    accentIcon: "eco",
    badge: "12% lower carbon emissions",
    brand: "Fleet Command",
    description:
      "An intelligent management system that turns logistics data into visual reports and supports faster decisions.",
    icon: "hub",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD71GiZjcbSj_iPfrsRfIB_FqJr0mTyGEU5r9JjqFKM50RXWb2TL1Fuq0sOISqFEROMbqGq7SYONVAqbNfB_0z3kTuwWGitrzbC9l7SyGOKwd5wEdSROhwxy2tNBfvlzIeYxK4UEUbHBqfDUy4XIk-8FSJc0ZtwF0jXTNwB1fbvPEUUJad9-qit2vdrCz2zirCde-58FjeuPLiBdXhneJE3f5eVtOrGYFlLYynDCnX7c_PUt-zNJFGp6x7P-OEikkt7awY-PRC7uBxi",
    overlay: "from-primary/70 via-primary/50 to-on-tertiary-fixed/20",
    protectedFlowLabel: "Secure connection",
    title: "Master your global transport network with complete transparency.",
  },
  otp: {
    accentIcon: "verified_user",
    badge: "Enterprise-grade ISO 27001 security",
    brand: "Precision Logistics",
    description:
      "Multi-layer security keeps your entire supply chain data protected.",
    icon: "eco",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXta_xAktJb3AEUH8_bwnSZqXMkJD69REqPi6oDUCsKhJTBFGmhWFQ4SYN3AIY-Al1Y6lKqe2J73vk3wVKBl_kKJDDNWBWaFfIe3KI8T1UeHVBXsxlr23-j4YkjxK_Rt_h3Qgbz593nVwLSLiW8IWDd9FKTSQ-nmZaew_oXa4N1Z3RPttBRUU7r202WqCnk9w1d4eF37liO6RP_qT33FCNULN1_1tOT0x_xwyPdW1CdUw8cbDBQhf54m3rQg4zt3O8qpkW3nFlrA9H",
    overlay: "from-primary via-primary/65 to-transparent",
    protectedFlowLabel: "Two-step verification",
    title: "Operate with precision in every rhythm",
  },
} as const;

export const loginFormCopy = {
  activeSessionLabel: "Remember password",
  apiDocsLabel: "System docs",
  connectGoogleLabel: "Connecting...",
  emailLabel: "Work email",
  emailPlaceholder: "name@precision-stream.com",
  footerCopyright: "© 2026 Precision Stream Logistics",
  forgotKeyLabel: "Forgot password?",
  fullNameLabel: "Full name",
  fullNamePlaceholder: "John Smith",
  googleOptions: [
    { icon: "account_circle", label: "Google" },
    { icon: "corporate_fare", label: "Business account" },
    { icon: "fingerprint", label: "Biometrics" },
  ],
  headerDescription:
    "Access the logistics management system to monitor and optimize your entire supply chain.",
  headerTitle: "Welcome to Emerald Logistics",
  loginLabel: "Log in",
  loginSuccessStatus:
    "Login successful. Redirecting to your operations workspace...",
  organizationLabel: "Organization",
  organizationPlaceholder: "ABC Corporation",
  orEnterWith: "Or sign in with",
  passwordLabel: "Password",
  passwordPlaceholder: "••••••••••••",
  phoneLabel: "Phone number",
  phonePlaceholder: "0900 111 222",
  privacyLabel: "Privacy",
  registerLabel: "Sign up",
  registerSuccessStatus:
    "Verification code sent. Continue to OTP confirmation.",
  submitLoading: "Processing...",
  submitLogin: "Open system",
  submitRegister: "Sign up and continue",
  supportLabel: "Support",
} as const;

export const forgotPasswordCopy = {
  backToLoginLabel: "Back to login",
  confirmPasswordLabel: "Confirm password",
  emailLabel: "Work email",
  emailPlaceholder: "name@precision-stream.com",
  headerDescription:
    "Receive a verification code to reset your administrator account password.",
  headerTitle: "Reset password",
  newPasswordLabel: "New password",
  passwordPlaceholder: "••••••••••••",
  status: "Verification code sent. Please check your email.",
  submit: "Send verification code",
  submitLoading: "Sending...",
  supportLabel: "Support",
} as const;

export const otpVerificationCopy = {
  footerPrivacy: "Privacy policy",
  footerSecureSession: "Secure session",
  footerSupport: "Support",
  resendLabel: "Resend code",
  verifyLoading: "Verifying...",
  verifyReset: "Verify and reset password",
  verifyComplete: "Verify and finish",
  infoTitle: "Having trouble?",
  ariaDigitLabel: (index: number) => `OTP digit ${index}`,
  forgotPassword: {
    description: (destination: string) =>
      `We sent a 6-digit code to ${destination}. Enter it below to confirm your password reset request.`,
    expiredStatus:
      "The password reset session has expired. Please request a new OTP.",
    help: "Check spam or confirm the email used for the password reset request.",
    resendStatus: (email: string) => `A new code has been sent to ${email}.`,
    successStatus: "Password updated. Redirecting to login...",
    title: "Verify password reset",
  },
  register: {
    description: (destination: string) =>
      `We sent a 6-digit code to ${destination}. Enter it below to finish account registration.`,
    expiredStatus: "The registration session has expired. Please request a new OTP.",
    help: "Check spam or confirm the contact information used during registration.",
    resendStatus: (email: string) => `A new code has been sent to ${email}.`,
    successStatus: "Verification successful. Redirecting to login...",
    title: "Security verification",
  },
} as const;

export const googleCallbackCopy = {
  backToLogin: "Back to login",
  errorCard: "Review the error above and try signing in again.",
  errorTitle: "Google sign-in failed",
  incompleteSession: "Google sign-in did not return a complete session.",
  loginSuccess:
    "Google sign-in successful. Redirecting to your operations workspace...",
  secureSessionCard:
    "Your session token is being stored securely in this browser session.",
  successTitle: "Google sign-in response",
  support: "Support",
} as const;

export const authRuntimeCopy = {
  missingForgotPasswordSession:
    "No password reset session found. Please request a new OTP.",
  missingPendingRegistration: "No pending registration session found.",
  missingRegisterSession:
    "No registration session found. Please request a new OTP.",
} as const;
