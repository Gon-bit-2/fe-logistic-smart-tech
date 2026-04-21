export const roleRequestCenterCopy = {
  approveLabel: "Duyệt yêu cầu",
  currentRoleLabel: "Vai trò hiện tại",
  description:
    "Gửi yêu cầu trở thành tài xế hoặc nhân viên kho, đồng thời theo dõi trạng thái duyệt theo thời gian thực.",
  historyTitle: "Lịch sử yêu cầu của bạn",
  loadErrorFallback:
    "Dịch vụ role request đang tạm thời gián đoạn. Vui lòng thử lại sau hoặc liên hệ quản trị viên nếu lỗi kéo dài.",
  loadErrorForbidden: "Bạn không có quyền truy cập trung tâm role request.",
  loadErrorUnauthorized:
    "Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại để tiếp tục thao tác role request.",
  pendingBanner:
    "Bạn đang có một yêu cầu chờ duyệt. Hãy đợi admin xử lý trước khi gửi yêu cầu mới.",
  refreshRoleBanner:
    "Yêu cầu đã được duyệt nhưng phiên đăng nhập hiện tại chưa cập nhật quyền mới. Hãy đăng xuất và đăng nhập lại.",
  reasonLabel: "Lý do đăng ký",
  submitLabel: "Gửi yêu cầu",
  targetRoleLabel: "Vai trò muốn đăng ký",
  title: "Role Request Center",
} as const;

export const roleRequestAdminCopy = {
  approveButton: "Approve",
  description:
    "Admin review queue cho các yêu cầu chuyển vai trò, bao gồm gán hub khi duyệt nhân viên kho.",
  emptyDescription: "Không còn yêu cầu nào trong queue hiện tại.",
  emptyTitle: "Queue trống",
  hubLabel: "Hub phụ trách",
  loadErrorFallback:
    "Queue role request đang tạm thời không khả dụng. Vui lòng thử lại sau hoặc kiểm tra backend.",
  queueTitle: "Queue chờ duyệt",
  rejectButton: "Reject",
  reviewNoteLabel: "Ghi chú review",
  title: "Role Requests Review",
} as const;
