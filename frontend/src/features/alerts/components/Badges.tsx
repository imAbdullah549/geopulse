import { Tag } from "@/components/badges/Tag";
import { tagStyles } from "@/components/badges/tagStyles";
import type { Severity } from "@/shared/types/device";
import type { AlertStatus } from "@/shared/types/alert";

function labelize(v: string) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export function SeverityBadge({ value }: { value: Severity }) {
  const label = labelize(value);
  return (
    <Tag className={tagStyles.severity[value]} title={label}>
      {label}
    </Tag>
  );
}

export function StatusBadge({ value }: { value: AlertStatus }) {
  const label = labelize(value);
  return (
    <Tag className={tagStyles.alertStatus[value]} title={label}>
      {label}
    </Tag>
  );
}
