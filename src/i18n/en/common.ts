export const appMetadata = {
  title: "Smart logistics platform",
  description:
    "A smart logistics interface for shipment tracking, fleet operations, and sustainable dispatching.",
} as const;

export const navbarCopy = {
  brand: "Emerald Logistics",
  contactLabel: "System",
  loginLabel: "Log in",
  registerLabel: "Sign up",
  menuLabel: "Menu",
  navItems: [
    { href: "#features", label: "Features" },
    { href: "#solutions", label: "Solutions" },
    { href: "/tracking", label: "Track shipment" },
    { href: "#sustainability", label: "Sustainability" },
  ],
} as const;

export const footerCopy = {
  brand: "Emerald Logistics",
  copyright: "© 2026 Emerald Logistics. Precision in every operating rhythm.",
  links: [
    { href: "#", label: "Privacy policy" },
    { href: "#", label: "Terms of service" },
    { href: "#", label: "Carbon report" },
    { href: "#", label: "Global network" },
  ],
} as const;

export const operationsTopBarCopy = {
  brand: "Precision Logistics",
  items: [
    { href: "/dashboard/admin", id: "dashboard", label: "Dashboard" },
    { href: "/orders/create", id: "shipments", label: "Shipments" },
    { href: "/tracking", id: "tracking", label: "Tracking" },
  ],
} as const;
