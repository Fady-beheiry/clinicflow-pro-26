import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

type Patient = {
  patient_name: string;
  phone: string;
  visits: number;
  last_visit: string;
  last_service: string;
};

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("appointments")
        .select("patient_name, phone, service, appointment_date")
        .order("appointment_date", { ascending: false });

      const map = new Map<string, Patient>();
      (data ?? []).forEach((a: any) => {
        const key = `${a.patient_name}|${a.phone}`;
        const existing = map.get(key);
        if (existing) {
          existing.visits += 1;
        } else {
          map.set(key, {
            patient_name: a.patient_name,
            phone: a.phone,
            visits: 1,
            last_visit: a.appointment_date,
            last_service: a.service,
          });
        }
      });
      setPatients(Array.from(map.values()).sort((a, b) => b.last_visit.localeCompare(a.last_visit)));
      setLoading(false);
    })();
  }, []);

  const filtered = patients.filter((p) =>
    !q || p.patient_name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q)
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Patients</h2>
          <p className="text-muted-foreground mt-1 text-sm">{patients.length} unique patients across all bookings.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient" className="pl-9 w-64" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
        {!loading && filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No patients yet — bookings from the website will show up here.
          </div>
        )}
        {filtered.map((p) => (
          <article key={p.patient_name + p.phone} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant transition-shadow">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-primary-foreground font-semibold">
                {p.patient_name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.patient_name}</div>
                <a href={`tel:${p.phone}`} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary">
                  <Phone className="h-3 w-3" /> {p.phone}
                </a>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center pt-4 border-t border-border">
              <div>
                <div className="text-lg font-bold">{p.visits}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Visits</div>
              </div>
              <div className="border-x border-border">
                <div className="text-xs font-medium">{format(new Date(p.last_visit), "MMM d")}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Last visit</div>
              </div>
              <div>
                <div className="text-xs font-medium truncate">{p.last_service}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Service</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Patients;