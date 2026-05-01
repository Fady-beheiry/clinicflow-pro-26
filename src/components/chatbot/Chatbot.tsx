import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Bot, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";

type Lang = "en" | "ar";
type Msg = { from: "bot" | "user"; text: string; choices?: { label: string; next: string }[] };

const t = {
  en: {
    title: "Nova Assistant",
    sub: "Typically replies in seconds",
    placeholder: "Type your message...",
    greet: "Hi 👋 I'm Nova's assistant. How can I help you today?",
    fallback: "I'm not sure I caught that. Want us to message you on WhatsApp?",
    askName: "Great! What's your name?",
    askPhone: "Thanks! And your phone number?",
    confirm: (n: string) => `Perfect, ${n} — we'll reach out shortly to confirm. ✅`,
    saved: "Lead saved",
    error: "Something went wrong. Please try again.",
    choices: [
      { label: "🕒 Working hours", next: "hours" },
      { label: "📍 Location", next: "location" },
      { label: "🦷 Services & pricing", next: "services" },
      { label: "📅 Book an appointment", next: "book" },
    ],
    answers: {
      hours: "We're open Saturday to Thursday, 10:00 AM — 9:00 PM. Closed Fridays.",
      location: "We're at 12 Garden City, Cairo. Private parking available.",
      services: "Cleanings from 600 EGP · Whitening from 2,500 EGP · Implants from 12,000 EGP. Want a full price list?",
      book: "Sure — I'll grab a few details and our team will confirm.",
    },
  },
  ar: {
    title: "مساعد نوفا",
    sub: "عادةً نرد خلال ثوانٍ",
    placeholder: "اكتب رسالتك...",
    greet: "أهلاً 👋 أنا مساعد نوفا. كيف أقدر أساعدك؟",
    fallback: "مش متأكد فهمت قصدك. تحب نتواصل معاك على واتساب؟",
    askName: "تمام! ممكن اسمك؟",
    askPhone: "شكراً! ورقم تليفونك؟",
    confirm: (n: string) => `تمام يا ${n}، هنتواصل معاك قريب لتأكيد الحجز. ✅`,
    saved: "تم حفظ بياناتك",
    error: "حصل خطأ، حاول تاني.",
    choices: [
      { label: "🕒 مواعيد العمل", next: "hours" },
      { label: "📍 العنوان", next: "location" },
      { label: "🦷 الخدمات والأسعار", next: "services" },
      { label: "📅 حجز موعد", next: "book" },
    ],
    answers: {
      hours: "بنفتح من السبت للخميس، 10 ص — 9 م. الجمعة إجازة.",
      location: "12 جاردن سيتي، القاهرة. فيه ركنة خاصة.",
      services: "تنظيف من 600 ج · تبييض من 2,500 ج · زراعة من 12,000 ج. تحب قائمة كاملة؟",
      book: "تمام — هنجمع كام معلومة بسيطة والفريق هيأكد معاك.",
    },
  },
};

const phoneSchema = z.string().trim().min(7).max(20);
const nameSchema = z.string().trim().min(2).max(60);

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [stage, setStage] = useState<"idle" | "askName" | "askPhone" | "done">("idle");
  const [lead, setLead] = useState<{ name?: string; phone?: string }>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const L = t[lang];

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: "bot", text: L.greet, choices: L.choices }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setMessages([]);
    setStage("idle");
    setLead({});
    if (open) setMessages([{ from: "bot", text: t[lang].greet, choices: t[lang].choices }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const push = (m: Msg) => setMessages((p) => [...p, m]);

  const handleChoice = (next: string) => {
    push({ from: "user", text: L.choices.find((c) => c.next === next)?.label ?? next });
    setTimeout(() => {
      if (next === "book") {
        push({ from: "bot", text: L.answers.book });
        push({ from: "bot", text: L.askName });
        setStage("askName");
      } else {
        push({ from: "bot", text: L.answers[next as keyof typeof L.answers] });
        push({ from: "bot", text: lang === "en" ? "Anything else?" : "حاجة تانية؟", choices: L.choices });
      }
    }, 400);
  };

  const saveLead = async (name: string, phone: string) => {
    const { error } = await supabase.from("chatbot_leads").insert({ name, phone, language: lang, message: "From chatbot booking flow" });
    if (error) {
      toast.error(L.error);
      return false;
    }
    toast.success(L.saved);
    return true;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    push({ from: "user", text });
    setInput("");

    if (stage === "askName") {
      const r = nameSchema.safeParse(text);
      if (!r.success) {
        setTimeout(() => push({ from: "bot", text: lang === "en" ? "Please enter a valid name (2+ chars)." : "من فضلك ادخل اسم صحيح." }), 300);
        return;
      }
      setLead((p) => ({ ...p, name: text }));
      setStage("askPhone");
      setTimeout(() => push({ from: "bot", text: L.askPhone }), 350);
      return;
    }

    if (stage === "askPhone") {
      const r = phoneSchema.safeParse(text);
      if (!r.success) {
        setTimeout(() => push({ from: "bot", text: lang === "en" ? "Please enter a valid phone number." : "من فضلك ادخل رقم صحيح." }), 300);
        return;
      }
      const name = lead.name ?? "there";
      const ok = await saveLead(name, text);
      if (ok) {
        setStage("done");
        setTimeout(() => push({ from: "bot", text: L.confirm(name), choices: L.choices }), 350);
      }
      return;
    }

    // Free text fallback
    setTimeout(() => {
      push({ from: "bot", text: L.fallback });
      push({ from: "bot", text: lang === "en" ? "Or pick one:" : "أو اختر:", choices: L.choices });
    }, 400);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow hover:scale-105 transition-transform"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-3rem)] origin-bottom-right transition-all duration-300",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col h-[540px] max-h-[80vh] rounded-3xl border border-border bg-card shadow-float overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-gradient-card">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
              </div>
              <div>
                <div className="font-semibold text-sm">{L.title}</div>
                <div className="text-xs text-muted-foreground">{L.sub}</div>
              </div>
            </div>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md px-2 py-1 hover:bg-muted"
            >
              <Globe className="h-3.5 w-3.5" /> {lang === "en" ? "AR" : "EN"}
            </button>
          </div>

          <div ref={scrollRef} dir={lang === "ar" ? "rtl" : "ltr"} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/20">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex flex-col gap-2", m.from === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.from === "user"
                      ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm"
                  )}
                >
                  {m.text}
                </div>
                {m.choices && (
                  <div className="flex flex-wrap gap-2 max-w-[90%]">
                    {m.choices.map((c) => (
                      <button
                        key={c.next}
                        onClick={() => handleChoice(c.next)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className="flex items-center gap-2 p-3 border-t border-border bg-card"
          >
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={L.placeholder} className="flex-1" />
            <Button type="submit" variant="hero" size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </>
  );
}