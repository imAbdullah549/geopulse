import type {
  DeviceHealth,
  DeviceStatus,
  DeviceType,
  DevicesSortField,
  Severity,
  SortOrder,
} from "@/shared/types/device";

export type DevicesFiltersValue = {
  search: string;
  type?: DeviceType[];
  status?: DeviceStatus[];
  health?: DeviceHealth[];
  severity?: Severity[];
  batteryMin?: number;
  batteryMax?: number;
  staleMins?: number;
  orderBy: DevicesSortField;
  order: SortOrder;
};

export type DevicesFiltersBarProps = {
  value: DevicesFiltersValue; // applied value (from page)
  disabled?: boolean;
  onApply: (next: DevicesFiltersValue) => void;
  onReset: () => void; // resets applied filters on the page
};
