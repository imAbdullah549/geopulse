import { Tag } from "@/components/badges/Tag";
import { tagStyles } from "@/components/badges/tagStyles";
import { labelize } from "@/lib/utils";
import type { Severity, DeviceStatus } from "@/shared/types/device";
import type { AlertStatus } from "@/shared/types/alert";

type CoreBadgeProps =
  | { type: "severity"; value: Severity }
  | { type: "deviceStatus"; value: DeviceStatus }
  | { type: "alertStatus"; value: AlertStatus };

export function StatusBadge(props: CoreBadgeProps) {
  const label = labelize(props.value);

  const className =
    props.type === "severity"
      ? tagStyles.severity[props.value]
      : props.type === "deviceStatus"
      ? tagStyles.deviceStatus[props.value]
      : tagStyles.alertStatus[props.value];

  return (
    <Tag className={className} title={label}>
      {label}
    </Tag>
  );
}

export function SeverityBadge({ value }: { value: Severity }) {
  return <StatusBadge type="severity" value={value} />;
}

export function DeviceStatusBadge({ value }: { value: DeviceStatus }) {
  return <StatusBadge type="deviceStatus" value={value} />;
}

export function AlertStatusBadge({ value }: { value: AlertStatus }) {
  return <StatusBadge type="alertStatus" value={value} />;
}
