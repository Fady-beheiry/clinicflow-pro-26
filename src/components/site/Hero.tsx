import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-clinic.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(hsl(var(--primary)/0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="container grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-20 lg:py-28">
        <div className="animate-float-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Accepting new patients this week
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.05]">
            A healthier smile,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">booked in seconds.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed text-balance">
            Nova Dental combines world-class dentistry with the convenience of modern booking, transparent pricing,
            and a calm, design-forward clinic experience.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/booking">Book Appointment <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a href="#services">Explore services</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> 15+ years experience</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Star className="h-4 w-4 text-warning" /> 4.9 / 5 — 820+ reviews</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-primary" /> Same-day appointments</div>
          </div>
        </div>

        <div className="relative animate-float-up [animation-delay:120ms]">
          <div className="relative rounded-3xl overflow-hidden shadow-float ring-1 ring-border">
            <img src={heroImg} alt="Modern Nova Dental clinic interior" width={1600} height={1200} className="w-full h-[480px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden sm:block bg-card border border-border rounded-2xl p-4 shadow-elegant w-64 animate-float-up [animation-delay:300ms]">
            <div className="text-xs text-muted-foreground">Next available</div>
            <div className="font-semibold mt-1">Today · 4:30 PM</div>
            <div className="mt-3 flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-7 w-7 rounded-full ring-2 ring-card bg-gradient-primary" />
              ))}
              <div className="h-7 w-7 rounded-full ring-2 ring-card bg-muted grid place-items-center text-[10px] font-semibold">+8</div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-elegant">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium">Open now</span>
          </div>
        </div>
      </div>
    </section>
  );
}