import type { ReactNode } from "react";
import { AlertCircle, DatabaseZap, Inbox, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type DataStatePanelProps = {
  title: string;
  description: string;
  icon: ReactNode;
  action?: ReactNode;
  className?: string;
};

function DataStatePanel({
  title,
  description,
  icon,
  action,
  className,
}: Readonly<DataStatePanelProps>) {
  return (
    <section
      className={cn(
        "rounded-[1.5rem] border border-outline-variant/18 bg-surface-container-lowest p-8 shadow-[0_24px_48px_-24px_rgba(6,78,59,0.12)]",
        className,
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed/35 text-primary">
            {icon}
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight text-on-surface">{title}</h2>
            <p className="max-w-3xl text-sm leading-6 text-on-surface-variant">
              {description}
            </p>
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  );
}

type SimpleStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function LoadingState({
  title,
  description,
  action,
  className,
}: Readonly<SimpleStateProps>) {
  return (
    <DataStatePanel
      title={title}
      description={description}
      action={action}
      className={className}
      icon={<LoaderCircle className="size-5 animate-spin" />}
    />
  );
}

export function ErrorState({
  title,
  description,
  action,
  className,
}: Readonly<SimpleStateProps>) {
  return (
    <DataStatePanel
      title={title}
      description={description}
      action={action}
      className={className}
      icon={<AlertCircle className="size-5" />}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: Readonly<SimpleStateProps>) {
  return (
    <DataStatePanel
      title={title}
      description={description}
      action={action}
      className={className}
      icon={<Inbox className="size-5" />}
    />
  );
}

export function IntegrationPendingState({
  title,
  description,
  action,
  className,
}: Readonly<SimpleStateProps>) {
  return (
    <DataStatePanel
      title={title}
      description={description}
      action={action}
      className={className}
      icon={<DatabaseZap className="size-5" />}
    />
  );
}
