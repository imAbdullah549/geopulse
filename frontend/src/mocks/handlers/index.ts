import { alertsHandlers } from "./alerts.handlers";
import { devicesHandlers } from "./devices.handlers";

export const handlers = [...alertsHandlers, ...devicesHandlers];
