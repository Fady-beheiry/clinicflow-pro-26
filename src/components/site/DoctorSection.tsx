import { Award, GraduationCap, Users } from "lucide-react";
import doctorImg from "@/assets/doctor.jpg";

export function DoctorSection() {
  return (
    <section id="doctor" className="bg-muted/30 border-y border-border scroll-mt-20">
      <div className="container py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="aspect-[4/5] max-w-md rounded-3xl overflow-hidden shadow-float ring-1 ring-border">
            <img src={doctorImg} alt="Dr. Karim Hassan, lead dentist" loading="lazy" width={1024} height={1280} className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-2 sm:right-12 bg-card border border-border rounded-2xl px-5 py-4 shadow-elegant">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">15+</div>
            <div className="text-xs text-muted-foreground">years of experience</div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="text-sm font-semibold text-primary uppercase tracking-wider">Meet your dentist</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Dr. Karim Hassan, DDS
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            With over a decade of experience and training across Cairo, Berlin and London,
            Dr. Karim leads Nova Dental with a single principle: dentistry should feel calm, clear and human.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { icon: GraduationCap, t: "DDS, Cairo University", d: "Postgrad in implantology, Charité Berlin" },
              { icon: Award, t: "Board-certified specialist", d: "Member of the Egyptian Dental Association" },
              { icon: Users, t: "5,000+ happy patients", d: "Trusted by families across Greater Cairo" },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}