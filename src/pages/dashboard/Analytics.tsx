import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

const Analytics = () => {
  const [perDay, setPerDay] = useState<{ day: string; count: number }[]>([]);
  const [byHour, setByHour] = useState<{ hour: string; count: number }[]>([]);
  const [byStatus, setByStatus] = useState<{ name: string; value: number }[]>([]);
  const [noShowRate, setNoShowRate] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("appointments").select("appointment_date, appointment_time, status");
      const all = data ?? [];

      // Per day (last 14 days)
      const days = Array.from({ length: 14 }).map((_, i) => format(subDays(new Date(), 13 - i), "yyyy-MM-dd"));
      setPerDay(days.map((d) => ({
        day: format(new Date(d), "MMM d"),
        count: all.filter((a: any) => a.appointment_date === d).length,
      })));

      // Peak hours
      const hourMap = new Map<string, number>();
      all.forEach((a: any) => hourMap.set(a.appointment_time, (hourMap.get(a.appointment_time) ?? 0) + 1));
      setByHour(Array.from(hourMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([hour, count]) => ({ hour, count })));

      // Status breakdown
      const statusMap = new Map<string, number>();
      all.forEach((a: any) => statusMap.set(a.status, (statusMap.get(a.status) ?? 0) + 1));
      setByStatus(Array.from(statusMap.entries()).map(([name, value]) => ({ name, value })));

      const cancelled = all.filter((a: any) => a.status === "cancelled").length;
      setNoShowRate(all.length ? Math.round((cancelled / all.length) * 100) : 0);
    })();
  }, []);

  const COLORS = ["hsl(214 95% 52%)", "hsl(199 95% 64%)", "hsl(152 60% 42%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)"];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground mt-1 text-sm">Trends across your bookings.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total bookings" value={String(perDay.reduce((s, x) => s + x.count, 0))} />
        <Stat label="Cancellation rate" value={`${noShowRate}%`} />
        <Stat label="Peak slot" value={byHour.sort((a, b) => b.count - a.count)[0]?.hour ?? "—"} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-semibold">Bookings — last 14 days</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <BarChart data={perDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="count" fill="hsl(214 95% 52%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-semibold">Peak hours</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={byHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Bar dataKey="count" fill="hsl(199 95% 64%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="font-semibold">Status breakdown</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
    <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="mt-2 text-2xl font-bold">{value}</div>
  </div>
);

export default Analytics;