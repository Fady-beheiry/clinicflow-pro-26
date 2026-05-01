import { Smile, Sparkles, Stethoscope, Shield, Baby, Crown } from "lucide-react";

export const SERVICES = [
  { icon: Smile, title: "Cleaning & Hygiene", desc: "Gentle, thorough cleanings that protect your enamel.", price: "from 600 EGP" },
  { icon: Sparkles, title: "Teeth Whitening", desc: "Brighter smile in a single visit, safely and comfortably.", price: "from 2,500 EGP" },
  { icon: Crown, title: "Crowns & Veneers", desc: "Premium ceramic restorations crafted to match perfectly.", price: "from 4,500 EGP" },
  { icon: Shield, title: "Root Canal", desc: "Pain-free endodontic care with rotary precision.", price: "from 1,800 EGP" },
  { icon: Stethoscope, title: "Implants", desc: "Titanium implants restoring full function and confidence.", price: "from 12,000 EGP" },
  { icon: Baby, title: "Pediatric Care", desc: "A friendly, fear-free experience for your little ones.", price: "from 400 EGP" },
];

export function Services() {
  return (
    <section id="services" className="container py-20 lg:py-28 scroll-mt-20">
      <div className="max-w-2xl">
        <div className="text-sm font-semibold text-primary uppercase tracking-wider">Services</div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          Everything your smile needs, under one roof.
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Transparent pricing. State-of-the-art equipment. A calm experience from check-in to check-out.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map(({ icon: Icon, title, desc, price }) => (
          <article key={title} className="group relative rounded-2xl border border-border bg-gradient-card p-6 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-300">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            <div className="mt-5 pt-5 border-t border-border text-sm font-medium text-primary">{price}</div>
          </article>
        ))}
      </div>
    </section>
  );
}