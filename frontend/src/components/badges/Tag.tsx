import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type TagProps = {
  children: ReactNode;
  className?: string;
  title?: string;
};

export function Tag({ children, className, title }: TagProps) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium leading-5",
        className
      )}
    >
      {children}
    </span>
  );
}
