import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { labelMulti } from "../../utils/deviceFilters";

type Props<T extends string> = {
  label: string;
  title?: string;
  values?: T[];
  options: readonly T[];
  disabled?: boolean;
  itemLabel?: (v: T) => ReactNode;
  onToggle: (v: T) => void;
};

export function MultiSelectFilterMenu<T extends string>({
  label,
  title,
  values,
  options,
  disabled,
  itemLabel,
  onToggle,
}: Props<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled} className="shrink-0">
          {labelMulti(label, values as unknown as string[] | undefined)}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        {title ? (
          <>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}

        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt}
            onSelect={(e) => e.preventDefault()}
            checked={!!values?.includes(opt)}
            onCheckedChange={() => onToggle(opt)}
          >
            {itemLabel ? itemLabel(opt) : opt}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
