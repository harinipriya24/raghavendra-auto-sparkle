import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { X, Phone, MessageCircle, Trophy } from "lucide-react";
import { FALLBACK_IMAGE, vehiclesByIdsQuery, vehicleImages } from "@/lib/catalog";
import { formatINR, PHONE_TEL, WHATSAPP_URL } from "@/lib/site";
import { useCompare } from "@/hooks/useCompare";

export const Route = createFileRoute("/compare")({
  component: ComparePage,
  head: () => ({
    meta: [
      { title: "Compare Vehicles — Raghavendra Auto Finance" },
      {
        name: "description",
        content:
          "Compare autos and cars side by side on price, engine, fuel, transmission, seating and availability before you buy in Jangaon.",
      },
      { property: "og:title", content: "Compare Vehicles — Raghavendra Auto Finance" },
      {
        property: "og:description",
        content: "Side-by-side comparison of autos and cars available in Jangaon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const ROWS: { label: string; get: (v: import("@/lib/catalog").Vehicle) => string }[] = [
  { label: "Price", get: (v) => formatINR(v.price) },
  { label: "Brand", get: (v) => v.brand },
  { label: "Engine / Power", get: (v) => v.engine || "—" },
  { label: "Fuel", get: (v) => v.fuel },
  { label: "Transmission", get: (v) => v.transmission },
  { label: "Seating", get: (v) => `${v.seating} seater` },
  { label: "Availability", get: (v) => (v.in_stock ? "In stock" : "Out of stock") },
  { label: "Colours", get: (v) => (v.colors.length ? v.colors.join(", ") : "—") },
];

function ComparePage() {
  const { ids, remove, clear, max } = useCompare();
  const { data: vehicles = [] } = useQuery(vehiclesByIdsQuery(ids));
  const ordered = ids.map((id) => vehicles.find((v) => v.id === id)).filter(Boolean) as typeof vehicles;

  const best = ordered.length >= 2 ? pickBest(ordered) : null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Compare
      </div>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Compare vehicles side by side</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Add up to {max} vehicles from the auto rickshaw or car listings and compare price, specs and
        availability in one view.
      </p>

      {ordered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">You haven&apos;t added any vehicles yet.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/auto-rickshaw-sales"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Browse auto rickshaws
            </Link>
            <Link
              to="/car-sales"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
            >
              Browse cars
            </Link>
          </div>
        </div>
      ) : (
        <>
          {best && (
            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-primary/40 bg-primary/5 p-6 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Our best pick</div>
                <Link to="/vehicles/$vehicleId" params={{ vehicleId: best.v.id }} className="mt-1 block text-xl font-bold hover:underline">
                  {best.v.name} — {formatINR(best.v.price)}
                </Link>
                <ul className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {best.reasons.map((r) => (
                    <li key={r} className="rounded-full border border-border bg-background px-2.5 py-0.5">{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-40 p-4 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    Vehicle
                  </th>
                  {ordered.map((v) => (
                    <th key={v.id} className={`p-4 text-left align-top ${best?.v.id === v.id ? "bg-primary/5" : ""}`}>
                      <div className="relative">
                        <button
                          onClick={() => remove(v.id)}
                          aria-label={`Remove ${v.name}`}
                          className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-border transition hover:bg-secondary"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <img
                          src={vehicleImages(v)[0]}
                          alt={v.name}
                          loading="lazy"
                          width={1200}
                          height={912}
                          onError={(event) => {
                            event.currentTarget.src = FALLBACK_IMAGE;
                          }}
                          className="aspect-[4/3] w-40 rounded-lg object-cover"
                        />
                        {best?.v.id === v.id && (
                          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                            <Trophy className="h-3 w-3" /> Best pick
                          </span>
                        )}
                        <Link
                          to="/vehicles/$vehicleId"
                          params={{ vehicleId: v.id }}
                          className="mt-3 block max-w-40 font-semibold hover:underline"
                        >
                          {v.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-border/60 last:border-0">
                    <td className="p-4 text-xs uppercase tracking-wider text-muted-foreground">
                      {row.label}
                    </td>
                    {ordered.map((v) => (
                      <td key={v.id} className="p-4 font-medium">
                        {row.get(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" /> Call to decide
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
            <button
              onClick={clear}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-secondary"
            >
              Clear comparison
            </button>
          </div>
        </>
      )}
    </section>
  );
}

type V = import("@/lib/catalog").Vehicle;

/** Scores vehicles on availability, value, seating, fuel economy and options. */
function pickBest(list: V[]) {
  const prices = list.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const maxSeat = Math.max(...list.map((v) => v.seating));
  const scored = list.map((v) => {
    const reasons: string[] = [];
    let score = 0;
    if (v.in_stock) { score += 30; reasons.push("In stock now"); }
    const value = max === min ? 1 : (max - v.price) / (max - min);
    score += value * 30;
    if (v.price === min) reasons.push("Lowest price");
    score += (v.seating / maxSeat) * 15;
    if (v.seating === maxSeat) reasons.push("Most seating");
    const fuel = v.fuel.toLowerCase();
    if (fuel.includes("electric")) { score += 15; reasons.push("Lowest running cost (Electric)"); }
    else if (fuel.includes("cng")) { score += 12; reasons.push("Economical CNG"); }
    else if (fuel.includes("diesel")) score += 6;
    score += Math.min(v.colors.length, 5);
    if (v.featured) score += 4;
    return { v, score, reasons };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0]!;
  if (top.reasons.length === 0) top.reasons.push("Best overall balance of price and features");
  return top;
}
