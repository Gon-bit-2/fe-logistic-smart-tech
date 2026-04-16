import {
  dispatcherMapRoutes,
  dispatcherMapStats,
  dispatcherRouteLegend,
} from "@/features/admin/data/dispatcher-dashboard.data";
import { cn } from "@/lib/utils";

export interface DispatcherMapCanvasProps {
  readonly className?: string;
}

export default function DispatcherMapCanvas({
  className,
}: Readonly<DispatcherMapCanvasProps>) {
  return (
    <section
      className={cn(
        "relative isolate min-h-[18rem] overflow-hidden bg-[#6c776f] md:min-h-[21rem] xl:min-h-[24rem]",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(73,88,79,0.72) 0%, rgba(103,114,107,0.46) 38%, rgba(117,132,123,0.38) 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.16) 0, transparent 20%), radial-gradient(circle at 78% 34%, rgba(111,251,190,0.14) 0, transparent 16%), radial-gradient(circle at 52% 72%, rgba(35,172,241,0.18) 0, transparent 22%), linear-gradient(180deg, rgba(27,35,31,0.08) 0%, rgba(27,35,31,0.42) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] opacity-75"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(111,251,190,0.08) 1px, transparent 1px), linear-gradient(rgba(111,251,190,0.14) 1px, transparent 1px)",
          backgroundPosition: "center bottom",
          backgroundSize: "6.2rem 3.1rem",
          transform: "perspective(900px) rotateX(67deg)",
          transformOrigin: "bottom center",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface/20 to-transparent" />

      <div className="absolute left-4 top-4 z-10 rounded-[1rem] border border-white/35 bg-white/82 px-4 py-3 shadow-[0_24px_40px_-22px_rgba(6,78,59,0.4)] backdrop-blur-xl md:left-6 md:top-6">
        <p className="text-[0.65rem] font-black uppercase tracking-[0.26em] text-on-surface/45">
          Live Fleet Stats
        </p>
        <div className="mt-3 flex gap-5">
          {dispatcherMapStats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(index === 1 && "border-l border-outline-variant/35 pl-5")}
            >
              <p
                className={cn(
                  "text-[1.7rem] font-black tracking-tight",
                  index === 0 ? "text-primary" : "text-tertiary",
                )}
              >
                {stat.value}
              </p>
              <p className="text-[0.62rem] font-medium text-on-surface/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-8 top-7 hidden h-40 w-[22rem] rounded-[1.8rem] border border-white/35 bg-white/10 shadow-[0_30px_60px_-32px_rgba(6,78,59,0.55)] backdrop-blur-md xl:block">
        <div className="absolute inset-4 rounded-[1.2rem] border border-white/20 bg-[radial-gradient(circle_at_55%_48%,rgba(111,251,190,0.28),transparent_16%),linear-gradient(160deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]">
          <div
            className="absolute inset-3 rounded-[1rem] opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(201,230,255,0.2) 1px, transparent 1px), linear-gradient(rgba(201,230,255,0.2) 1px, transparent 1px)",
              backgroundSize: "2.6rem 2rem",
            }}
          />
          <div className="absolute left-[12%] top-[54%] size-2.5 rounded-full bg-tertiary shadow-[0_0_16px_rgba(35,172,241,0.85)]" />
          <div className="absolute left-[48%] top-[28%] size-3.5 rounded-full bg-primary-fixed shadow-[0_0_20px_rgba(111,251,190,0.85)]" />
          <div className="absolute right-[12%] top-[62%] size-2.5 rounded-full bg-primary shadow-[0_0_16px_rgba(0,108,73,0.85)]" />
        </div>
      </div>

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 960 360"
        fill="none"
        preserveAspectRatio="none"
      >
        {dispatcherMapRoutes.map((route) => (
          <g key={route.path}>
            <path
              d={route.path}
              stroke={route.tone === "green" ? "rgba(0,108,73,0.95)" : "rgba(0,101,145,0.86)"}
              strokeDasharray="10 8"
              strokeLinecap="round"
              strokeWidth="2.8"
            />
            {route.points.map((point) => (
              <circle
                key={`${route.path}-${point.x}-${point.y}`}
                cx={point.x}
                cy={point.y}
                fill={route.tone === "green" ? "#006c49" : "#006591"}
                r="4"
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-wrap items-center justify-center gap-4 rounded-full border border-white/35 bg-white/82 px-4 py-2.5 shadow-[0_30px_48px_-24px_rgba(6,78,59,0.42)] backdrop-blur-xl md:bottom-5 md:px-5 md:py-3">
        {dispatcherRouteLegend.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <span
              className={cn(
                "size-3 rounded-full",
                item.tone === "green"
                  ? "bg-primary shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                  : item.tone === "blue"
                    ? "bg-tertiary shadow-[0_0_12px_rgba(35,172,241,0.7)]"
                    : "bg-surface-dim",
              )}
            />
            <span className="text-xs font-bold text-on-surface">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
