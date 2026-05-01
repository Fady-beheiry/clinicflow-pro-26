import { Sparkles, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 mt-24">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            Nova Dental
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Modern dental care, designed around you. From routine cleanings to advanced implants — booked in seconds.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Visit us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" /> 12 Garden City, Cairo</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 mt-0.5" /> +20 100 000 0000</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 mt-0.5" /> hello@novadental.eg</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Hours</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Sat – Thu · 10:00 — 21:00</li>
            <li>Friday · Closed</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nova Dental Clinic · All rights reserved · {" "}
        <Link to="/auth" className="hover:text-foreground">Staff login</Link>
      </div>
    </footer>
  );
}