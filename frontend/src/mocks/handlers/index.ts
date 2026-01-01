import { alertsHandlers } from "./alerts.handlers";
import { devicesHandlers } from "./devices.handlers";
import { mapHandlers } from "./map.handlers";

export const handlers = [...alertsHandlers, ...devicesHandlers, ...mapHandlers];
