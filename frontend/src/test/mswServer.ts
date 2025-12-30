import { setupServer } from "msw/node";
import { handlers } from "@/mocks/handlers/alerts.handlers";

export const server = setupServer(...handlers);
