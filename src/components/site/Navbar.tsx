import { Link, useLocation } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#doctor", label: "Our Doctor" },
  { href: "/#testimonials", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-[Plus_Jakarta_Sans] tracking-tight">Nova Dental</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <a href="tel:+201000000000">Call us</a>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/booking">Book Appointment</Link>
          </Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div className={cn("md:hidden overflow-hidden transition-all", open ? "max-h-96 border-t border-border" : "max-h-0")}>
        <div className="container py-4 flex flex-col gap-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium py-2">
              {l.label}
            </a>
          ))}
          <Button asChild variant="hero" size="sm" className="mt-2">
            <Link to="/booking" onClick={() => setOpen(false)}>Book Appointment</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}