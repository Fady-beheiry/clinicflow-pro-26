import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
  return (
    <section id="contact" className="bg-muted/30 border-t border-border scroll-mt-20">
      <div className="container py-20 lg:py-28 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="text-sm font-semibold text-primary uppercase tracking-wider">Visit us</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Drop in, or just say hi.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            We're a few minutes from downtown Cairo, with private parking and step-free access.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><MapPin className="h-5 w-5" /></div>
              <div><div className="font-semibold">12 Garden City</div><div className="text-sm text-muted-foreground">Cairo, Egypt</div></div>
            </li>
            <li className="flex gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><Phone className="h-5 w-5" /></div>
              <div><div className="font-semibold">+20 100 000 0000</div><div className="text-sm text-muted-foreground">Sat–Thu, 10:00 — 21:00</div></div>
            </li>
            <li className="flex gap-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><Clock className="h-5 w-5" /></div>
              <div><div className="font-semibold">Open today until 21:00</div><div className="text-sm text-muted-foreground">Closed Fridays</div></div>
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg"><a href="tel:+201000000000"><Phone className="h-4 w-4" /> Call now</a></Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://wa.me/201000000000" target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            </Button>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-border shadow-elegant min-h-[420px] bg-card">
          <iframe
            title="Nova Dental location"
            src="https://www.google.com/maps?q=Garden+City+Cairo&output=embed"
            className="w-full h-full min-h-[420px] border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}