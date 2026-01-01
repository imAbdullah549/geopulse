import { cn } from "@/lib/utils";

export const FILTER_WIDTH = 180;

export const controlBase =
  "h-10 bg-background border-border/70 shadow-sm focus-visible:ring-2 focus-visible:ring-ring/40";

export const rootClass = "flex flex-col gap-3 md:flex-row md:items-center";
export const rowWrapClass =
  "flex w-full flex-wrap gap-3 md:w-auto md:flex-nowrap md:justify-end";

export const inputClass = cn(controlBase, "w-full md:flex-1 md:min-w-[360px]");

export const triggerClass = cn(
  controlBase,
  "w-full md:w-[180px] justify-between px-3 [&>span]:truncate"
);

export const contentClass = "w-[180px]";
