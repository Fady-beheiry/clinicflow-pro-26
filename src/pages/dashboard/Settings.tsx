import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Settings = () => {
  const { user, role } = useAuth();
  const [clinic, setClinic] = useState({
    name: "Nova Dental Clinic",
    address: "12 Garden City, Cairo",
    phone: "+20 100 000 0000",
    hours: "Sat – Thu, 10:00 — 21:00 · Closed Fridays",
    bio: "Modern dental care for the whole family.",
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">Clinic profile and account details.</p>
      </div>

      <Card title="Clinic profile" desc="Public information shown across your booking pages.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Clinic name" value={clinic.name} onChange={(v) => setClinic({ ...clinic, name: v })} />
          <Field label="Phone" value={clinic.phone} onChange={(v) => setClinic({ ...clinic, phone: v })} />
          <div className="sm:col-span-2">
            <Field label="Address" value={clinic.address} onChange={(v) => setClinic({ ...clinic, address: v })} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Working hours" value={clinic.hours} onChange={(v) => setClinic({ ...clinic, hours: v })} />
          </div>
          <div className="sm:col-span-2">
            <Label>About</Label>
            <Textarea value={clinic.bio} onChange={(e) => setClinic({ ...clinic, bio: e.target.value })} rows={3} className="mt-1.5" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="hero" onClick={() => toast.success("Settings saved (demo)")}>Save changes</Button>
        </div>
      </Card>

      <Card title="Your account" desc="Logged in as the clinic team.">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="font-medium">{user?.email}</div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-soft text-primary capitalize">{role}</span>
        </div>
      </Card>
    </div>
  );
};

const Card = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
    <h3 className="font-semibold">{title}</h3>
    <p className="text-xs text-muted-foreground mt-1 mb-5">{desc}</p>
    {children}
  </section>
);

const Field = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <Label>{label}</Label>
    <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5" />
  </div>
);

export default Settings;