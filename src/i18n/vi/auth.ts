export const authHeroPanelContent = {
  auth: {
    accentIcon: "eco",
    badge: "Giảm 12% dấu chân carbon trên mỗi vận đơn",
    brand: "Fleet Command",
    description:
      "Trải nghiệm Precision Stream biến dữ liệu logistics thô thành những câu chuyện vận hành trực quan, có thể hành động ngay.",
    icon: "hub",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD71GiZjcbSj_iPfrsRfIB_FqJr0mTyGEU5r9JjqFKM50RXWb2TL1Fuq0sOISqFEROMbqGq7SYONVAqbNfB_0z3kTuwWGitrzbC9l7SyGOKwd5wEdSROhwxy2tNBfvlzIeYxK4UEUbHBqfDUy4XIk-8FSJc0ZtwF0jXTNwB1fbvPEUUJad9-qit2vdrCz2zirCde-58FjeuPLiBdXhneJE3f5eVtOrGYFlLYynDCnX7c_PUt-zNJFGp6x7P-OEikkt7awY-PRC7uBxi",
    overlay: "from-primary/70 via-primary/50 to-on-tertiary-fixed/20",
    protectedFlowLabel: "Luồng bảo vệ",
    title: "Làm chủ đội xe toàn cầu với độ rõ nét tuyệt đối.",
  },
  otp: {
    accentIcon: "verified_user",
    badge: "Bảo mật cấp doanh nghiệp đạt chứng nhận ISO 27001",
    brand: "Precision Logistics",
    description:
      "Lớp xác minh nâng cao giúp mọi workspace luôn an toàn trong khi chuỗi cung ứng vẫn vận hành hiệu quả.",
    icon: "eco",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXta_xAktJb3AEUH8_bwnSZqXMkJD69REqPi6oDUCsKhJTBFGmhWFQ4SYN3AIY-Al1Y6lKqe2J73vk3wVKBl_kKJDDNWBWaFfIe3KI8T1UeHVBXsxlr23-j4YkjxK_Rt_h3Qgbz593nVwLSLiW8IWDd9FKTSQ-nmZaew_oXa4N1Z3RPttBRUU7r202WqCnk9w1d4eF37liO6RP_qT33FCNULN1_1tOT0x_xwyPdW1CdUw8cbDBQhf54m3rQg4zt3O8qpkW3nFlrA9H",
    overlay: "from-primary via-primary/65 to-transparent",
    protectedFlowLabel: "Luồng bảo vệ",
    title: "Chính xác trong từng nhịp vận hành",
  },
} as const;

export const loginFormCopy = {
  activeSessionLabel: "Duy trì phiên đăng nhập trong 24 giờ",
  apiDocsLabel: "Tài liệu API",
  connectGoogleLabel: "Đang kết nối...",
  emailLabel: "Email tổ chức",
  emailPlaceholder: "ten@precision-stream.com",
  footerCopyright: "© 2026 Precision Stream Logistics",
  forgotKeyLabel: "Quên khoá?",
  fullNameLabel: "Họ và tên",
  fullNamePlaceholder: "Marcus Thorne",
  googleOptions: [
    { icon: "account_circle", label: "Google" },
    { icon: "corporate_fare", label: "SSO doanh nghiệp" },
    { icon: "fingerprint", label: "Sinh trắc học" },
  ],
  headerDescription:
    "Truy cập bảng điều khiển logistics chính xác và xử lý luồng checkout khách hàng với cấu trúc sẵn sàng cho production.",
  headerTitle: "Chào mừng đến với Emerald Logistics",
  loginLabel: "Đăng nhập",
  loginSuccessStatus: "Phiên làm việc đã được tạo. Đang chuyển tới không gian vận hành...",
  organizationLabel: "Tổ chức",
  organizationPlaceholder: "Sustainable Goods Co.",
  orEnterWith: "Hoặc tiếp tục với",
  passwordLabel: "Khoá bảo mật",
  passwordPlaceholder: "••••••••••••",
  phoneLabel: "Số liên hệ",
  phonePlaceholder: "+84 900 111 222",
  privacyLabel: "Bảo mật",
  registerLabel: "Đăng ký",
  registerSuccessStatus: "Mã xác thực đã được gửi. Tiếp tục tới bước xác nhận OTP.",
  submitLoading: "Đang xử lý...",
  submitLogin: "Truy cập Fleet Command",
  submitRegister: "Đăng ký và tiếp tục",
  supportLabel: "Hỗ trợ",
} as const;

export const forgotPasswordCopy = {
  backToLoginLabel: "Quay lại đăng nhập",
  confirmPasswordLabel: "Xác nhận mật khẩu",
  emailLabel: "Email tổ chức",
  emailPlaceholder: "ten@precision-stream.com",
  headerDescription:
    "Yêu cầu mã dùng một lần và chọn mật khẩu mới cho workspace logistics của bạn.",
  headerTitle: "Đặt lại khoá truy cập",
  newPasswordLabel: "Mật khẩu mới",
  passwordPlaceholder: "••••••••••••",
  status: "Mã xác thực đã được gửi. Tiếp tục tới bước xác nhận OTP.",
  submit: "Gửi mã đặt lại",
  submitLoading: "Đang xử lý...",
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
    expiredStatus: "Phiên đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu OTP mới.",
    help:
      "Hãy kiểm tra thư rác hoặc xác nhận lại email đã dùng trong yêu cầu đặt lại mật khẩu.",
    resendStatus: (email: string) => `Mã mới đã được gửi tới ${email}.`,
    successStatus: "Mật khẩu đã được cập nhật. Đang chuyển về trang đăng nhập...",
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
  loginSuccess: "Đăng nhập Google thành công. Đang chuyển tới không gian vận hành...",
  secureSessionCard:
    "Token phiên của bạn đang được lưu an toàn trong phiên trình duyệt.",
  successTitle: "Phản hồi đăng nhập Google",
  support: "Hỗ trợ",
} as const;

export const authRuntimeCopy = {
  missingForgotPasswordSession:
    "Không tìm thấy phiên đặt lại mật khẩu. Vui lòng yêu cầu OTP mới.",
  missingPendingRegistration: "Không tìm thấy phiên đăng ký đang chờ.",
  missingRegisterSession: "Không tìm thấy phiên đăng ký. Vui lòng yêu cầu OTP mới.",
} as const;
