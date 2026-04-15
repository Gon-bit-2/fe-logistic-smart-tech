type AuthHeroPanelProps = Readonly<{
  variant: "auth" | "otp";
}>;

const PANEL_CONTENT = {
  auth: {
    brand: "Fleet Command",
    icon: "hub",
    title: "Command your global fleet with absolute clarity.",
    description:
      "The Precision Stream experience transforms raw logistics data into actionable, high-precision visual narratives.",
    badge: "12% reduced carbon footprint per manifest",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD71GiZjcbSj_iPfrsRfIB_FqJr0mTyGEU5r9JjqFKM50RXWb2TL1Fuq0sOISqFEROMbqGq7SYONVAqbNfB_0z3kTuwWGitrzbC9l7SyGOKwd5wEdSROhwxy2tNBfvlzIeYxK4UEUbHBqfDUy4XIk-8FSJc0ZtwF0jXTNwB1fbvPEUUJad9-qit2vdrCz2zirCde-58FjeuPLiBdXhneJE3f5eVtOrGYFlLYynDCnX7c_PUt-zNJFGp6x7P-OEikkt7awY-PRC7uBxi",
    overlay: "from-primary/70 via-primary/50 to-on-tertiary-fixed/20",
    accentIcon: "eco",
  },
  otp: {
    brand: "Precision Logistics",
    icon: "eco",
    title: "Precision in Every Pulse",
    description:
      "Advanced verification keeps every workspace secure while your supply chain stays efficient.",
    badge: "ISO 27001 certified enterprise-grade security",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXta_xAktJb3AEUH8_bwnSZqXMkJD69REqPi6oDUCsKhJTBFGmhWFQ4SYN3AIY-Al1Y6lKqe2J73vk3wVKBl_kKJDDNWBWaFfIe3KI8T1UeHVBXsxlr23-j4YkjxK_Rt_h3Qgbz593nVwLSLiW8IWDd9FKTSQ-nmZaew_oXa4N1Z3RPttBRUU7r202WqCnk9w1d4eF37liO6RP_qT33FCNULN1_1tOT0x_xwyPdW1CdUw8cbDBQhf54m3rQg4zt3O8qpkW3nFlrA9H",
    overlay: "from-primary via-primary/65 to-transparent",
    accentIcon: "verified_user",
  },
} as const;

export default function AuthHeroPanel({ variant }: AuthHeroPanelProps) {
  const content = PANEL_CONTENT[variant];

  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-primary lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
      <img
        src={content.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-overlay"
      />
      <div className={`absolute inset-0 bg-gradient-to-tr ${content.overlay}`} />

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-primary shadow-lg">
          <span className="material-symbols-outlined">{content.icon}</span>
        </div>
        <span className="text-xl font-black tracking-tight text-white">
          {content.brand}
        </span>
      </div>

      <div className="relative z-10 max-w-xl space-y-6">
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white xl:text-6xl">
          {content.title}
        </h1>
        <p className="max-w-lg text-lg leading-8 text-white/80">
          {content.description}
        </p>
      </div>

      <div className="relative z-10 inline-flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white backdrop-blur-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed/20 text-primary-fixed">
          <span className="material-symbols-outlined">{content.accentIcon}</span>
        </div>
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] uppercase text-white/70">
            Protected flow
          </p>
          <p className="text-sm font-semibold">{content.badge}</p>
        </div>
      </div>
    </section>
  );
}
