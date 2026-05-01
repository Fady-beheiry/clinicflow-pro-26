import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { StatusPill } from "./Overview";
import { useAuth } from "@/hooks/useAuth";

type Appt = {
  id: string; service: string; appointment_date: string; appointment_time: string;
  patient_name: string; phone: string; notes: string | null; status: string; created_at: string;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const Appointments = () => {
  const { role } = useAuth();
  const [rows, setRows] = useState<Appt[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as Appt[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setRows((r) => r.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success("Status updated");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setRows((r) => r.filter((a) => a.id !== id));
    toast.success("Deleted");
  };

  const filtered = rows.filter((a) => {
    const matchQ = !q || a.patient_name.toLowerCase().includes(q.toLowerCase()) || a.phone.includes(q);
    const matchF = filter === "all" || a.status === filter;
    return matchQ && matchF;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointments</h2>
          <p className="text-muted-foreground mt-1 text-sm">Manage every booking from one place.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone" className="pl-9 w-64" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Patient</th>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Date & time</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No appointments match your filters.</td></tr>
              )}
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground text-xs font-semibold">
                        {a.patient_name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{a.patient_name}</div>
                        {a.notes && <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{a.notes}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{a.service}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{format(new Date(a.appointment_date), "MMM d, yyyy")}</div>
                    <div className="text-xs text-muted-foreground">{a.appointment_time}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{a.phone}</td>
                  <td className="px-6 py-4">
                    <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v)}>
                      <SelectTrigger className="h-8 w-36 border-0 bg-transparent shadow-none p-0 hover:bg-muted">
                        <StatusPill status={a.status} />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4">
                    {role === "admin" && (
                      <Button variant="ghost" size="icon" onClick={() => remove(a.id)} aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;