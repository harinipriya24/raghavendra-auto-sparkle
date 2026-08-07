import { Phone, MessageCircle, Mail } from "lucide-react";
import { EMAIL, PHONE_TEL, WHATSAPP_URL } from "@/lib/site";

/** Floating desktop buttons + sticky mobile contact bar. */
export function FloatingContact() {
  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 hidden flex-col gap-3 md:flex">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:scale-105 hover:bg-emerald-600"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
        <a
          href={PHONE_TEL}
          aria-label="Call now"
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105"
        >
          <Phone className="h-5 w-5" />
        </a>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-2 border-t border-border/60 bg-background/95 p-3 backdrop-blur md:hidden">
        <a
          href={PHONE_TEL}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground"
        >
          <Phone className="h-3.5 w-3.5" /> Call
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2.5 text-xs font-semibold text-white"
        >
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 py-2.5 text-xs font-semibold"
        >
          <Mail className="h-3.5 w-3.5" /> Email
        </a>
      </div>
    </>
  );
}
