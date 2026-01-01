import { Tag } from "@/components/badges/Tag";
import { tagStyles } from "@/components/badges/tagStyles";
import type { DeviceStatus } from "@/shared/types/device";

export function StatusBadge({ status }: { status: DeviceStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <Tag className={tagStyles.deviceStatus[status]} title={label}>
      {label}
    </Tag>
  );
}
