import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { z } from "zod";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/components/site/Services";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SLOTS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

const schema = z.object({
  service: z.string().min(1, "Please choose a service"),
  date: z.date({ required_error: "Pick a date" }),
  time: z.string().min(1, "Pick a time"),
  patient_name: z.string().trim().min(2, "Name is too short").max(80),
  phone: z.string().trim().min(7, "Phone is too short").max(20),
  notes: z.string().trim().max(500).optional(),
});

const Booking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<{
    service: string; date: Date | undefined; time: string;
    patient_name: string; phone: string; notes: string;
  }>({ service: "", date: undefined, time: "", patient_name: "", phone: "", notes: "" });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      service: parsed.data.service,
      appointment_date: format(parsed.data.date, "yyyy-MM-dd"),
      appointment_time: parsed.data.time,
      patient_name: parsed.data.patient_name,
      phone: parsed.data.phone,
      notes: parsed.data.notes || null,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not book — please try again");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-hero">
        <Navbar />
        <main className="flex-1 grid place-items-center container py-20">
          <div className="max-w-md text-center animate-float-up">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mt-6 text-3xl font-bold">You're booked!</h1>
            <p className="mt-3 text-muted-foreground">
              We've sent your request to the clinic. You'll get a confirmation on{" "}
              <span className="font-medium text-foreground">{form.phone}</span> shortly.
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left text-sm shadow-soft">
              <Row label="Service" value={form.service} />
              <Row label="Date" value={form.date ? format(form.date, "EEEE, MMM d") : ""} />
              <Row label="Time" value={form.time} />
              <Row label="Name" value={form.patient_name} />
            </div>
            <Button variant="hero" size="lg" className="mt-6" onClick={() => navigate("/")}>Back to home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-hero">
        <div className="container py-12 lg:py-16 max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <div className="mt-4 flex items-center justify-between gap-3 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Book your visit</h1>
              <p className="mt-2 text-muted-foreground">Takes about 30 seconds.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
              {[1, 2, 3].map((n) => (
                <div key={n} className={cn(
                  "grid h-7 w-7 place-items-center rounded-full border",
                  step >= n ? "bg-gradient-primary text-primary-foreground border-transparent" : "bg-card text-muted-foreground border-border"
                )}>{n}</div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-elegant">
            {step === 1 && (
              <section className="animate-float-up">
                <h2 className="text-lg font-semibold">Choose a service</h2>
                <p className="text-sm text-muted-foreground mt-1">Which treatment are you interested in?</p>
                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => { update("service", s.title); setStep(2); }}
                      className={cn(
                        "group text-left rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-elegant",
                        form.service === s.title ? "border-primary bg-primary-soft" : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                          <s.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{s.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{s.price}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="animate-float-up">
                <h2 className="text-lg font-semibold">Pick a date & time</h2>
                <p className="text-sm text-muted-foreground mt-1">Selected service: <span className="font-medium text-foreground">{form.service}</span></p>

                <div className="mt-5 grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.date && "text-muted-foreground")}>
                          <CalendarIcon className="h-4 w-4" />
                          {form.date ? format(form.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={form.date}
                          onSelect={(d) => update("date", d)}
                          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0)) || d.getDay() === 5}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="mt-2 text-xs text-muted-foreground">Closed on Fridays.</p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Time slot</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {SLOTS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => update("time", s)}
                          className={cn(
                            "rounded-lg border px-2 py-2 text-sm transition-colors",
                            form.time === s
                              ? "border-primary bg-gradient-primary text-primary-foreground"
                              : "border-border bg-card hover:border-primary/40 hover:bg-primary-soft"
                          )}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button variant="hero" onClick={() => { if (!form.date || !form.time) { toast.error("Pick a date and time"); return; } setStep(3); }}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="animate-float-up">
                <h2 className="text-lg font-semibold">Your details</h2>
                <p className="text-sm text-muted-foreground mt-1">We'll only use this to confirm your appointment.</p>

                <div className="mt-5 grid gap-4">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={form.patient_name} onChange={(e) => update("patient_name", e.target.value)} placeholder="Mariam Ahmed" maxLength={80} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+20 100 000 0000" maxLength={20} inputMode="tel" />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Anything we should know?" maxLength={500} rows={3} />
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-muted/50 border border-border p-4 text-sm">
                  <div className="font-medium">Booking summary</div>
                  <div className="mt-2 grid gap-1 text-muted-foreground">
                    <div>{form.service}</div>
                    <div>{form.date ? format(form.date, "EEEE, MMM d") : ""} at {form.time}</div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                  <Button variant="hero" size="lg" onClick={submit} disabled={submitting}>
                    {submitting ? "Booking..." : "Confirm appointment"}
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-1.5 border-b border-border last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default Booking;