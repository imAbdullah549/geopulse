import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageShellProps = {
  header?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageShell({ header, children, className }: PageShellProps) {
  return (
    <div className={cn("h-full p-4 space-y-4 flex flex-col", className)}>
      {header}
      {children}
    </div>
  );
}
