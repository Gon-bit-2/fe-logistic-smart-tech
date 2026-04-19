export const authHeroPanelContent = {
  auth: {
    accentIcon: "eco",
    badge: "Giảm 12% lượng khí thải carbon",
    brand: "Fleet Command",
    description:
      "Hệ thống quản lý thông minh giúp chuyển hóa dữ liệu logistics thành các báo cáo trực quan, hỗ trợ ra quyết định nhanh chóng.",
    icon: "hub",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD71GiZjcbSj_iPfrsRfIB_FqJr0mTyGEU5r9JjqFKM50RXWb2TL1Fuq0sOISqFEROMbqGq7SYONVAqbNfB_0z3kTuwWGitrzbC9l7SyGOKwd5wEdSROhwxy2tNBfvlzIeYxK4UEUbHBqfDUy4XIk-8FSJc0ZtwF0jXTNwB1fbvPEUUJad9-qit2vdrCz2zirCde-58FjeuPLiBdXhneJE3f5eVtOrGYFlLYynDCnX7c_PUt-zNJFGp6x7P-OEikkt7awY-PRC7uBxi",
    overlay: "from-primary/70 via-primary/50 to-on-tertiary-fixed/20",
    protectedFlowLabel: "Kết nối an toàn",
    title: "Làm chủ mạng lưới vận tải toàn cầu với sự minh bạch tuyệt đối.",
  },
  otp: {
    accentIcon: "verified_user",
    badge: "Đạt chuẩn bảo mật doanh nghiệp ISO 27001",
    brand: "Precision Logistics",
    description:
      "Hệ thống bảo mật đa lớp đảm bảo an toàn tuyệt đối cho toàn bộ dữ liệu chuỗi cung ứng của bạn.",
    icon: "eco",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXta_xAktJb3AEUH8_bwnSZqXMkJD69REqPi6oDUCsKhJTBFGmhWFQ4SYN3AIY-Al1Y6lKqe2J73vk3wVKBl_kKJDDNWBWaFfIe3KI8T1UeHVBXsxlr23-j4YkjxK_Rt_h3Qgbz593nVwLSLiW8IWDd9FKTSQ-nmZaew_oXa4N1Z3RPttBRUU7r202WqCnk9w1d4eF37liO6RP_qT33FCNULN1_1tOT0x_xwyPdW1CdUw8cbDBQhf54m3rQg4zt3O8qpkW3nFlrA9H",
    overlay: "from-primary via-primary/65 to-transparent",
    protectedFlowLabel: "Xác thực 2 bước",
    title: "Vận hành chính xác trong từng nhịp độ",
  },
} as const;

export const loginFormCopy = {
  activeSessionLabel: "Nhớ mật khẩu",
  apiDocsLabel: "Tài liệu hệ thống",
  connectGoogleLabel: "Đang kết nối...",
  emailLabel: "Email tổ chức",
  emailPlaceholder: "ten@precision-stream.com",
  footerCopyright: "© 2026 Precision Stream Logistics",
  forgotKeyLabel: "Quên mật khẩu?",
  fullNameLabel: "Họ và tên",
  fullNamePlaceholder: "Nguyễn Văn A",
  googleOptions: [
    { icon: "account_circle", label: "Google" },
    { icon: "corporate_fare", label: "Tài khoản doanh nghiệp" },
    { icon: "fingerprint", label: "Sinh trắc học" },
  ],
  headerDescription:
    "Truy cập hệ thống quản trị logistics để theo dõi và tối ưu hoá toàn bộ chuỗi cung ứng của doanh nghiệp.",
  headerTitle: "Chào mừng đến với Emerald Logistics",
  loginLabel: "Đăng nhập",
  loginSuccessStatus:
    "Đăng nhập thành công. Đang chuyển tới không gian vận hành...",
  organizationLabel: "Tổ chức",
  organizationPlaceholder: "Công ty Cổ phần ABC",
  orEnterWith: "Hoặc đăng nhập với",
  passwordLabel: "Mật khẩu",
  passwordPlaceholder: "••••••••••••",
  phoneLabel: "Số điện thoại",
  phonePlaceholder: "0900 111 222",
  privacyLabel: "Bảo mật",
  registerLabel: "Đăng ký",
  registerSuccessStatus:
    "Mã xác thực đã được gửi. Tiếp tục tới bước xác nhận OTP.",
  submitLoading: "Đang xử lý...",
  submitLogin: "Truy cập hệ thống",
  submitRegister: "Đăng ký và tiếp tục",
  supportLabel: "Hỗ trợ",
} as const;

export const forgotPasswordCopy = {
  backToLoginLabel: "Quay lại đăng nhập",
  confirmPasswordLabel: "Xác nhận mật khẩu",
  emailLabel: "Email tổ chức",
  emailPlaceholder: "ten@precision-stream.com",
  headerDescription:
    "Nhận mã xác thực để đặt lại mật khẩu cho tài khoản quản trị của bạn.",
  headerTitle: "Khôi phục mật khẩu",
  newPasswordLabel: "Mật khẩu mới",
  passwordPlaceholder: "••••••••••••",
  status: "Mã xác thực đã được gửi. Hãy kiểm tra email của bạn.",
  submit: "Gửi mã xác thực",
  submitLoading: "Đang gửi...",
  supportLabel: "Hỗ trợ",
} as const;

export const otpVerificationCopy = {
  footerPrivacy: "Chính sách bảo mật",
  footerSecureSession: "Phiên bảo mật",
  footerSupport: "Hỗ trợ",
  resendLabel: "Gửi lại mã",
  verifyLoading: "Đang xác minh...",
  verifyReset: "Xác minh và đặt lại mật khẩu",
  verifyComplete: "Xác minh và hoàn tất",
  infoTitle: "Đang gặp sự cố?",
  ariaDigitLabel: (index: number) => `Chữ số OTP ${index}`,
  forgotPassword: {
    description: (destination: string) =>
      `Chúng tôi đã gửi mã 6 chữ số tới ${destination}. Nhập bên dưới để xác nhận yêu cầu đặt lại mật khẩu.`,
    expiredStatus:
      "Phiên đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu OTP mới.",
    help: "Hãy kiểm tra thư rác hoặc xác nhận lại email đã dùng trong yêu cầu đặt lại mật khẩu.",
    resendStatus: (email: string) => `Mã mới đã được gửi tới ${email}.`,
    successStatus:
      "Mật khẩu đã được cập nhật. Đang chuyển về trang đăng nhập...",
    title: "Xác minh đặt lại mật khẩu",
  },
  register: {
    description: (destination: string) =>
      `Chúng tôi đã gửi mã 6 chữ số tới ${destination}. Nhập bên dưới để hoàn tất đăng ký workspace.`,
    expiredStatus: "Phiên đăng ký đã hết hạn. Vui lòng yêu cầu OTP mới.",
    help: "Hãy kiểm tra thư rác hoặc xác nhận lại thông tin liên hệ đã dùng khi đăng ký.",
    resendStatus: (email: string) => `Mã mới đã được gửi tới ${email}.`,
    successStatus: "Xác minh thành công. Đang chuyển về trang đăng nhập...",
    title: "Xác minh bảo mật",
  },
} as const;

export const googleCallbackCopy = {
  backToLogin: "Quay lại đăng nhập",
  errorCard: "Hãy xem lại lỗi phía trên rồi thử đăng nhập lại.",
  errorTitle: "Đăng nhập Google thất bại",
  incompleteSession: "Đăng nhập Google không trả về phiên làm việc đầy đủ.",
  loginSuccess:
    "Đăng nhập Google thành công. Đang chuyển tới không gian vận hành...",
  secureSessionCard:
    "Token phiên của bạn đang được lưu an toàn trong phiên trình duyệt.",
  successTitle: "Phản hồi đăng nhập Google",
  support: "Hỗ trợ",
} as const;

export const authRuntimeCopy = {
  missingForgotPasswordSession:
    "Không tìm thấy phiên đặt lại mật khẩu. Vui lòng yêu cầu OTP mới.",
  missingPendingRegistration: "Không tìm thấy phiên đăng ký đang chờ.",
  missingRegisterSession:
    "Không tìm thấy phiên đăng ký. Vui lòng yêu cầu OTP mới.",
} as const;
