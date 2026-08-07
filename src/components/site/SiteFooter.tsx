import { Link } from "@tanstack/react-router";
import { ADDRESS_LINES, EMAIL, PHONE, PHONE_TEL, WHATSAPP_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
              R
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold">RAGHAVENDRA AUTO FINANCE</div>
              <div className="text-xs text-muted-foreground">
                Trusted Auto Sales &amp; Vehicle Finance Services.
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Buying, selling and exchange of auto rickshaws and cars, complete documentation support,
            and finance against registered vehicle documents — all from our Jangaon office.
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Explore
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <Link to="/auto-rickshaw-sales" className="block text-muted-foreground hover:text-foreground">
              Auto Rickshaw Sales
            </Link>
            <Link to="/car-sales" className="block text-muted-foreground hover:text-foreground">
              Car Sales
            </Link>
            <Link to="/finance" className="block text-muted-foreground hover:text-foreground">
              Finance Eligibility
            </Link>
            <Link to="/compare" className="block text-muted-foreground hover:text-foreground">
              Compare Vehicles
            </Link>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Contact
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <a href={PHONE_TEL} className="block hover:text-foreground">
              {PHONE}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-foreground"
            >
              WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`} className="block break-all hover:text-foreground">
              {EMAIL}
            </a>
            <div className="pt-2 leading-relaxed">
              {ADDRESS_LINES.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Raghavendra Auto Finance. Jangaon, Telangana.</div>
          <div>Finance offered only against registered vehicle documents.</div>
        </div>
      </div>
    </footer>
  );
}
