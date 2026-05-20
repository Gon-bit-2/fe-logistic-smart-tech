import Image from "next/image";
import AppIcon from "@/components/ui/app-icon";
import { useTranslations } from "next-intl";
import type { AuthHeroPanelProps } from "@/features/auth/presentation/types";
import type { AppIconName } from "@/components/ui/app-icon";

export default function AuthHeroPanel({ variant }: AuthHeroPanelProps) {
  const tAuthHero = useTranslations("auth.heroPanel");

  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-primary lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12">
      <Image
        src={tAuthHero(`${variant}.image` as any)}
        alt=""
        fill
        className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-overlay"
      />
      <div className={`absolute inset-0 bg-gradient-to-tr ${tAuthHero(`${variant}.overlay` as any)}`} />

      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-primary shadow-lg">
          <AppIcon name={tAuthHero(`${variant}.icon` as any) as AppIconName} />
        </div>
        <span className="text-xl font-black tracking-tight text-white">
          {tAuthHero(`${variant}.brand` as any)}
        </span>
      </div>

      <div className="relative z-10 max-w-xl space-y-6">
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white xl:text-6xl">
          {tAuthHero(`${variant}.title` as any)}
        </h1>
        <p className="max-w-lg text-lg leading-8 text-white/80">
          {tAuthHero(`${variant}.description` as any)}
        </p>
      </div>

      <div className="relative z-10 inline-flex w-fit items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white backdrop-blur-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed/20 text-primary-fixed">
          <AppIcon name={tAuthHero(`${variant}.accentIcon` as any) as AppIconName} />
        </div>
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] uppercase text-white/70">
            {tAuthHero(`${variant}.protectedFlowLabel` as any)}
          </p>
          <p className="text-sm font-semibold">{tAuthHero(`${variant}.badge` as any)}</p>
        </div>
      </div>
    </section>
  );
}
