import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, BarChart3, Settings, Sparkles, LogOut, Bell, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", end: true, icon: LayoutDashboard, label: "Overview" },
  { to: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
  { to: "/dashboard/patients", icon: Users, label: "Patients" },
  { to: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function DashboardLayout() {
  const { user, role, signOut } = useAuth();
  const { pathname } = useLocation();
  const current = nav.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)));

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg px-6 h-16 border-b border-border">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          Nova Dental
        </Link>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground font-semibold text-sm">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.email}</div>
              <div className="text-xs text-muted-foreground capitalize">{role}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8">
          <div>
            <h1 className="text-lg font-semibold">{current?.label ?? "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Search"><Search className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="md:hidden" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}