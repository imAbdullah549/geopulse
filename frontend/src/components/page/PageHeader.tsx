import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  isUpdating?: boolean;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  isUpdating,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl/7 font-bold text-foreground sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">
            {subtitle}
            {isUpdating ? " • Updating…" : null}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
