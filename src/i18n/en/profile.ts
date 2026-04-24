export const profileScreenCopy = {
  title: "Profile & settings",
  description:
    "Manage account information, address book, and personal operations settings.",
  tabs: {
    account: "Account",
    addressBook: "Address book",
    access: "Access & notifications",
    security: "Security",
  },
  account: {
    cardTitle: "Operations profile",
    cardDescription:
      "This information is used in dashboards and coordinated operations workflows.",
    profileId: "User ID",
    role: "Role",
    hubId: "Hub ID",
    syncReady: "Synced",
    syncPending: "Unsaved changes",
    syncDescription:
      "Account information is updated directly to the current user profile through the secure API.",
    fullNameLabel: "Full name / business name",
    fullNamePlaceholder: "Emerald Logistics Company",
    phoneLabel: "Contact phone",
    phonePlaceholder: "0900 111 222",
    emailLabel: "Login email",
    emailHint: "Email cannot be changed directly from the profile interface yet.",
    save: "Save changes",
    savePending: "Saving...",
    reset: "Restore original data",
    savedState: "Profile information updated successfully.",
    dirtyState: "You have unsaved changes.",
    cleanState: "Personal information matches the latest server data.",
    validationName: "Please enter a valid display name.",
    validationPhone: "Phone number should contain 9-15 digits.",
  },
  addressBook: {
    title: "Address book",
    description:
      "Save frequent pickup and delivery points to create future orders faster.",
    add: "Add address",
    edit: "Edit",
    delete: "Delete",
    setDefault: "Set default",
    defaultBadge: "Default",
    emptyTitle: "No addresses yet",
    emptyDescription:
      "Create your first pickup or delivery point to standardize contact information and order creation.",
    dialogCreateTitle: "Add new address",
    dialogEditTitle: "Update address",
    dialogDescription:
      "Information will be saved directly to the current account address book.",
    save: "Save address",
    create: "Create address",
    cancel: "Cancel",
    fields: {
      label: "Address label",
      contactName: "Contact person",
      phone: "Phone number",
      addressLine: "Address details",
      setAsDefault: "Set as default address",
    },
    placeholders: {
      label: "Main warehouse District 7",
      contactName: "John Smith",
      phone: "0911 223 344",
      addressLine: "123 Nguyen Van Linh, District 7, Ho Chi Minh City",
    },
    validation: {
      label: "Address label is required.",
      contactName: "Please enter a contact name.",
      phone: "Address phone number is invalid.",
      addressLine: "Please enter address details.",
    },
    loading: "Loading address book...",
    loadError: "Unable to load address book right now.",
  },
  access: {
    title: "Account coordination",
    description:
      "Track system notifications and role requests from the customer workspace.",
    notificationsTitle: "Notification inbox",
    notificationsDescription:
      "Open the inbox to view approvals, reminders, and operations updates.",
    notificationsCta: "Open inbox",
    rolesTitle: "Role requests",
    rolesDescription:
      "Track or submit requests to become a driver or warehouse staff member from the dashboard.",
    rolesCta: "Open role center",
  },
  security: {
    title: "Security & login",
    description:
      "Manage the primary login channel and open the password reset flow when needed.",
    emailTitle: "Login email",
    emailDescription:
      "This is the primary login identifier for the current account and cannot be changed directly yet.",
    resetTitle: "Change password",
    resetDescription:
      "Use the forgot password flow to receive an OTP and reset your password securely.",
    resetCta: "Open security flow",
  },
  loadErrorUnauthorized: "Your session has expired. Please log in again.",
  loadErrorForbidden: "You do not have permission to access this profile.",
  loadErrorFallback: "Unable to load profile information right now.",
} as const;
