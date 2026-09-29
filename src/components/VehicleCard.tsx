import { Link } from "@tanstack/react-router";
import {
  Phone,
  MessageCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  GitCompareArrows,
} from "lucide-react";
import { formatINR, PHONE_TEL, WHATSAPP_URL } from "@/lib/site";
import { vehicleImages, type Vehicle } from "@/lib/catalog";
import { useCompare } from "@/hooks/useCompare";

export function VehicleCard({ v }: { v: Vehicle }) {
  const { ids, toggle, isFull } = useCompare();
  const selected = ids.includes(v.id);
  const image = vehicleImages(v)[0]!;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        to="/vehicles/$vehicleId"
        params={{ vehicleId: v.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-secondary"
      >
        <img
          src={image}
          alt={v.name}
          loading="lazy"
          width={1200}
          height={912}
          onError={(event) => {
            event.currentTarget.src = vehicleImages({ images: [] })[0];
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {v.in_stock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              <CheckCircle2 className="h-3 w-3" /> In stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              <XCircle className="h-3 w-3" /> Out of stock
            </span>
          )}
          {v.featured && (
            <span className="inline-flex rounded-full bg-primary/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              Featured
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
          {v.brand}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">
            <Link to="/vehicles/$vehicleId" params={{ vehicleId: v.id }} className="hover:underline">
              {v.name}
            </Link>
          </h3>
          <div className="whitespace-nowrap text-lg font-bold text-primary">
            {formatINR(v.price)}
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{v.description}</p>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <Spec label="Engine" value={v.engine || "—"} />
          <Spec label="Fuel" value={v.fuel} />
          <Spec label="Transmission" value={v.transmission} />
          <Spec label="Seating" value={`${v.seating} seater`} />
        </dl>

        {v.colors.length > 0 && (
          <div className="mt-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Colours
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {v.colors.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          <div className="grid grid-cols-3 gap-2">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Phone className="h-3.5 w-3.5" /> Call
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <Link
              to="/vehicles/$vehicleId"
              params={{ vehicleId: v.id }}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2.5 text-xs font-semibold transition hover:bg-secondary"
            >
              Details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <button
            onClick={() => toggle(v.id)}
            disabled={!selected && isFull}
            className={`mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
            {selected ? "Added to compare" : "Add to compare"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}
