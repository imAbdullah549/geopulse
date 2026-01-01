import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FilterTag } from "../types";

export function ActiveFilterTags({ tags }: { tags: FilterTag[] }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Badge key={t.key} variant="secondary" className="gap-2">
          {t.label}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={t.onRemove}
            aria-label={`Remove ${t.label}`}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
}
