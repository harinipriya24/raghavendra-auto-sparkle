import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  CheckCircle2,
  XCircle,
  GitCompareArrows,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FALLBACK_IMAGE, vehicleQuery, vehicleImages } from "@/lib/catalog";
import { formatINR, PHONE_TEL, swatchFor, whatsappFor } from "@/lib/site";
import { EmiCalculator } from "@/components/EmiCalculator";
import { EnquiryForm } from "@/components/EnquiryForm";
import { useCompare } from "@/hooks/useCompare";

export const Route = createFileRoute("/vehicles/$vehicleId")({
  component: VehicleDetails,
  head: () => ({
    meta: [
      { title: "Vehicle Details — Raghavendra Auto Finance" },
      {
        name: "description",
        content:
          "Full specifications, images, price, availability and EMI estimate for vehicles available at Raghavendra Auto Finance, Jangaon.",
      },
      { property: "og:title", content: "Vehicle Details — Raghavendra Auto Finance" },
      {
        property: "og:description",
        content: "Specifications, price, availability and EMI estimate for this vehicle.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function VehicleDetails() {
  const { vehicleId } = Route.useParams();
  const { data: v, isLoading } = useQuery(vehicleQuery(vehicleId));
  const { ids, toggle, isFull } = useCompare();
  const [active, setActive] = useState(0);
  const [colour, setColour] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="h-96 animate-pulse rounded-2xl border border-border bg-card" />
      </div>
    );
  }

  if (!v) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold">Vehicle not found</h1>
        <p className="mt-3 text-muted-foreground">
          This vehicle may have been sold or removed from our inventory.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/auto-rickshaw-sales"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Browse autos
          </Link>
          <Link
            to="/car-sales"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
          >
            Browse cars
          </Link>
        </div>
      </div>
    );
  }

  const images = vehicleImages(v);
  const index = Math.min(active, images.length - 1);
  const selected = ids.includes(v.id);

  return (
    <>
      <div className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            to={v.category === "auto" ? "/auto-rickshaw-sales" : "/car-sales"}
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {v.category === "auto" ? "auto rickshaws" : "cars"}
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* GALLERY */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary">
              <img
                src={images[index]}
                alt={v.name}
                width={1200}
                height={912}
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="h-full w-full object-cover"
              />
              {colour && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-color"
                  style={{ backgroundColor: swatchFor(colour), opacity: 0.75 }}
                />
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActive((index - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActive((index + 1) % images.length)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
              <div className="absolute left-3 top-3">
                {v.in_stock ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    <CheckCircle2 className="h-3 w-3" /> In stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    <XCircle className="h-3 w-3" /> Out of stock
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setActive(i)}
                    className={`aspect-[4/3] overflow-hidden rounded-lg border transition ${
                      i === index ? "border-primary" : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${v.name} photo ${i + 1}`}
                      loading="lazy"
                      width={1200}
                      height={912}
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SUMMARY */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {v.brand}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{v.name}</h1>
            <div className="mt-3 text-3xl font-bold text-primary">{formatINR(v.price)}</div>
            <p className="mt-4 leading-relaxed text-muted-foreground">{v.description}</p>

            <dl className="mt-7 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Spec label="Engine / Power" value={v.engine || "—"} />
              <Spec label="Fuel" value={v.fuel} />
              <Spec label="Transmission" value={v.transmission} />
              <Spec label="Seating" value={`${v.seating} seater`} />
              {v.year ? <Spec label="Model year" value={String(v.year)} /> : null}
              {v.km_driven ? (
                <Spec label="KM driven" value={`${v.km_driven.toLocaleString("en-IN")} km`} />
              ) : null}
            </dl>

            {v.colors.length > 0 && (
              <div className="mt-6">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Choose colour{colour ? <span className="ml-1 normal-case text-foreground">· {colour}</span> : null}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {v.colors.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColour(colour === c ? null : c)}
                      aria-pressed={colour === c}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                        colour === c
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className="h-3.5 w-3.5 rounded-full border border-border" style={{ backgroundColor: swatchFor(c) }} />
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              <a
                href={PHONE_TEL}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a
                href={whatsappFor(`Hi, I am interested in ${v.name}${colour ? ` (${colour})` : ""}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <button
                onClick={() => toggle(v.id)}
                disabled={!selected && isFull}
                className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-3 text-sm font-semibold transition disabled:opacity-50 ${
                  selected ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"
                }`}
              >
                <GitCompareArrows className="h-4 w-4" /> {selected ? "In compare" : "Compare"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-2">
          <EmiCalculator price={v.price} compact />
          <EnquiryForm
            kind="booking"
            vehicleId={v.id}
            vehicleName={v.name}
            title="Book a visit or test drive"
            description="Tell us when you'd like to come to our Jangaon office and we'll keep this vehicle ready for you."
            submitLabel="Book now"
          />
        </div>
      </section>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
