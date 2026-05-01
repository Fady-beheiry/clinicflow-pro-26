import { useEffect, useState } from "react";
import { Calendar, Users, TrendingUp, AlertTriangle, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Stat = { label: string; value: string; sub: string; icon: any; tone: string };
type Appt = { id: string; patient_name: string; service: string; appointment_date: string; appointment_time: string; status: string };

const Overview = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [upcoming, setUpcoming] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const [allRes, todayRes, upcomingRes, leadsRes] = await Promise.all([
        supabase.from("appointments").select("id, status", { count: "exact" }),
        supabase.from("appointments").select("id", { count: "exact" }).eq("appointment_date", today),
        supabase.from("appointments").select("*").gte("appointment_date", today).order("appointment_date").order("appointment_time").limit(6),
        supabase.from("chatbot_leads").select("id", { count: "exact" }),
      ]);

      const all = allRes.data ?? [];
      const completed = all.filter((a) => a.status === "completed").length;
      const cancelled = all.filter((a) => a.status === "cancelled").length;
      // Mock revenue: 800 EGP per completed
      const revenue = completed * 800;

      setStats([
        { label: "Today's appointments", value: String(todayRes.count ?? 0), sub: "scheduled today", icon: Calendar, tone: "primary" },
        { label: "Total appointments", value: String(allRes.count ?? 0), sub: `${completed} completed`, icon: TrendingUp, tone: "success" },
        { label: "Chatbot leads", value: String(leadsRes.count ?? 0), sub: "captured all-time", icon: Users, tone: "primary" },
        { label: "Cancellations", value: String(cancelled), sub: "to follow up", icon: AlertTriangle, tone: "warning" },
      ]);
      setUpcoming((upcomingRes.data ?? []) as Appt[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold">Welcome back 👋</h2>
        <p className="text-muted-foreground mt-1">Here's how your clinic is doing today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(loading ? Array.from({ length: 4 }).map((_, i) => ({ label: "", value: "—", sub: "", icon: Calendar, tone: "primary" } as Stat)) : stats).map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.tone === "warning" ? "bg-warning/10 text-warning" : s.tone === "success" ? "bg-success/10 text-success" : "bg-primary-soft text-primary"}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold tracking-tight">{s.value}</div>
            <div className="mt-1 text-sm font-medium">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold">Upcoming appointments</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Next 6 visits, ordered by date.</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard/appointments">View all <ArrowUpRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="divide-y divide-border">
          {upcoming.length === 0 && !loading && (
            <div className="p-12 text-center text-sm text-muted-foreground">No upcoming appointments yet.</div>
          )}
          {upcoming.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-6 py-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold">
                {a.patient_name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{a.patient_name}</div>
                <div className="text-xs text-muted-foreground truncate">{a.service}</div>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium">{format(new Date(a.appointment_date), "MMM d")}</div>
                <div className="text-xs text-muted-foreground">{a.appointment_time}</div>
              </div>
              <StatusPill status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    confirmed: "bg-primary-soft text-primary",
    completed: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${map[status] ?? "bg-muted"}`}>
      {status}
    </span>
  );
};

export default Overview;