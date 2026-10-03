import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, Menu, X, GitCompareArrows } from "lucide-react";
import { PHONE_TEL } from "@/lib/site";
import { useCompare } from "@/hooks/useCompare";
const ownerLogo = "/owner-logo.jpg";

const links = [
  { to: "/", label: "Home" },
  { to: "/auto-rickshaw-sales", label: "Auto Rickshaws" },
  { to: "/car-sales", label: "Cars" },
  { to: "/finance", label: "Finance" },
  { to: "/compare", label: "Compare" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { ids } = useCompare();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={ownerLogo}
            alt="Raghavendra Auto Finance"
            className="h-10 w-10 rounded-full border border-border object-cover object-top shadow-sm"
          />
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight">RAGHAVENDRA</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Auto Finance
            </div>
          </div>
        </Link>

        <nav className="hidden gap-7 text-sm font-medium lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/compare"
            className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-border transition hover:bg-secondary sm:flex"
            aria-label="Compare vehicles"
          >
            <GitCompareArrows className="h-4 w-4" />
            {ids.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {ids.length}
              </span>
            )}
          </Link>
          <a
            href={PHONE_TEL}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Phone className="h-3.5 w-3.5" /> Call Now
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background px-6 py-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
