import type { ComponentPropsWithoutRef } from "react";
import {
  BadgeCheck,
  Bell,
  Building2,
  CircleAlert,
  CircleCheckBig,
  CircleHelp,
  CircleUserRound,
  Fingerprint,
  Globe2,
  Leaf,
  LoaderCircle,
  LockKeyhole,
  Network,
  Package,
  PencilLine,
  PlayCircle,
  Printer,
  ReceiptText,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  account_circle: CircleUserRound,
  check_circle: CircleCheckBig,
  corporate_fare: Building2,
  draw: PencilLine,
  eco: Leaf,
  fingerprint: Fingerprint,
  hub: Network,
  info: CircleAlert,
  inventory_2: Package,
  local_shipping: Truck,
  lock: LockKeyhole,
  notifications: Bell,
  play_circle: PlayCircle,
  print: Printer,
  progress_activity: LoaderCircle,
  public: Globe2,
  receipt_long: ReceiptText,
  search: Search,
  settings: Settings2,
  share: Share2,
  verified: BadgeCheck,
  verified_user: ShieldCheck,
} satisfies Record<string, LucideIcon>;

export type AppIconName = keyof typeof ICONS;

export type AppIconProps = ComponentPropsWithoutRef<"svg"> & {
  readonly name: AppIconName | string;
};

export default function AppIcon({
  name,
  className,
  ...props
}: Readonly<AppIconProps>) {
  const Icon = ICONS[name] ?? CircleHelp;

  return (
    <Icon
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn("size-5 shrink-0", className)}
      {...props}
    />
  );
}
