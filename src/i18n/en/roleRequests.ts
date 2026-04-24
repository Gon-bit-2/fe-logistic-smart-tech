export const roleRequestCenterCopy = {
  approveLabel: "Approved request",
  currentRoleLabel: "Current role",
  description:
    "Submit a request to become a driver or warehouse staff member and track approval status in real time.",
  historyTitle: "Your request history",
  loadErrorFallback:
    "The role request service is temporarily unavailable. Try again later or contact an administrator if the issue continues.",
  loadErrorForbidden: "You do not have permission to access the role request center.",
  loadErrorUnauthorized:
    "Your session has expired. Log in again to continue role request actions.",
  pendingBanner:
    "You have a pending request. Wait for an admin to process it before submitting a new one.",
  refreshRoleBanner:
    "The request was approved but the current session has not refreshed the new permission. Log out and log in again.",
  reasonLabel: "Request reason",
  submitLabel: "Submit request",
  targetRoleLabel: "Requested role",
  title: "Role Request Center",
} as const;

export const roleRequestAdminCopy = {
  approveButton: "Approve",
  description:
    "Admin review queue for role change requests, including hub assignment when approving warehouse staff.",
  emptyDescription: "No requests remain in the current queue.",
  emptyTitle: "Queue is empty",
  hubLabel: "Assigned hub",
  loadErrorFallback:
    "The role request queue is temporarily unavailable. Try again later or check the backend.",
  queueTitle: "Pending review queue",
  rejectButton: "Reject",
  reviewNoteLabel: "Review note",
  title: "Role Requests Review",
} as const;
