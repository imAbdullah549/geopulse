import { Tag } from "@/components/badges/Tag";
import { tagStyles } from "@/components/badges/tagStyles";
import type { Severity } from "@/shared/types/device";

export function SeverityBadge({ severity }: { severity: Severity }) {
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  return (
    <Tag className={tagStyles.severity[severity]} title={label}>
      {label}
    </Tag>
  );
}
