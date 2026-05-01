import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/201000000000?text=Hello%20Nova%20Dental"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-float hover:scale-105 transition-transform animate-pulse-ring"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}