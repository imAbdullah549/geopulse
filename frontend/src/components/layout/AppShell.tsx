import { NavLink } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/alerts", label: "Alerts" },
  { to: "/map", label: "Map" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh grid grid-cols-[260px_1fr]">
      {/* Sidebar: fixed height, scroll only if it overflows */}
      <aside className="h-dvh border-r bg-background">
        <div className="h-full overflow-y-auto p-4">
          <div className="mb-6">
            <div className="text-lg font-semibold">GeoPulse</div>
            <div className="text-sm text-muted-foreground">
              IoT & Geospatial Console
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Right side: header fixed, main area controls scrolling */}
      <div className="h-dvh flex flex-col">
        <header className="sticky top-0 z-20 border-b bg-background px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Demo environment (MSW)
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-hidden bg-muted/20">
          {children}
        </main>

        <Toaster richColors />
      </div>
    </div>
  );
}
