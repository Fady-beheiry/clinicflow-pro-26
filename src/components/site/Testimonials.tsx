import { Star } from "lucide-react";

const reviews = [
  { name: "Mariam A.", text: "Honestly the calmest dental visit I've ever had. The booking was effortless and Dr. Karim explained every step.", rating: 5 },
  { name: "Omar S.", text: "Best whitening result I've seen — and the clinic feels more like a boutique hotel than a clinic.", rating: 5 },
  { name: "Yasmine F.", text: "My kids actually ask to go back. That alone is worth five stars. The staff are wonderful.", rating: 5 },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="container py-20 lg:py-28 scroll-mt-20">
      <div className="max-w-2xl">
        <div className="text-sm font-semibold text-primary uppercase tracking-wider">Patients say</div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-balance">
          Loved by 5,000+ patients across Cairo.
        </h2>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {reviews.map((r) => (
          <figure key={r.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex gap-0.5">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <blockquote className="mt-4 text-foreground leading-relaxed">"{r.text}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground font-semibold">
                {r.name[0]}
              </div>
              <div className="text-sm font-medium">{r.name}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}