import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Phone,
  MessageCircle,
  Mail,
  Search,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatINR, type Vehicle } from "@/data/vehicles";

type Props = {
  title: string;
  eyebrow: string;
  intro: string;
  vehicles: Vehicle[];
};

const PHONE = "9908459309";
const WHATSAPP = "919908459309";

export function VehicleListingPage({ title, eyebrow, intro, vehicles }: Props) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [priceBand, setPriceBand] = useState("all");
  const [sort, setSort] = useState("featured");

  const brands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand))).sort(),
    [vehicles],
  );
  const fuels = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.fuel))).sort(),
    [vehicles],
  );

  const filtered = useMemo(() => {
    let list = vehicles.filter((v) => {
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q);
      const matchesBrand = brand === "all" || v.brand === brand;
      const matchesFuel = fuel === "all" || v.fuel === fuel;
      const matchesPrice =
        priceBand === "all" ||
        (priceBand === "u3" && v.price < 300000) ||
        (priceBand === "3to7" && v.price >= 300000 && v.price < 700000) ||
        (priceBand === "7to12" && v.price >= 700000 && v.price < 1200000) ||
        (priceBand === "o12" && v.price >= 1200000);
      return matchesQ && matchesBrand && matchesFuel && matchesPrice;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [vehicles, query, brand, fuel, priceBand, sort]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
              R
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">RAGHAVENDRA</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Auto Finance
              </div>
            </div>
          </Link>
          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <Link to="/" className="text-muted-foreground transition hover:text-foreground">Home</Link>
            <Link to="/auto-rickshaw-sales" className="text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Autos</Link>
            <Link to="/car-sales" className="text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Cars</Link>
          </nav>
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Phone className="h-3.5 w-3.5" /> Call Now
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{intro}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> Jangaon, Telangana
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="relative md:col-span-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, brand, keyword…"
                className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
              />
            </div>
            <Select
              className="md:col-span-2"
              value={brand}
              onChange={setBrand}
              label="Brand"
              options={[{ v: "all", l: "All brands" }, ...brands.map((b) => ({ v: b, l: b }))]}
            />
            <Select
              className="md:col-span-2"
              value={fuel}
              onChange={setFuel}
              label="Fuel"
              options={[{ v: "all", l: "All fuel types" }, ...fuels.map((f) => ({ v: f, l: f }))]}
            />
            <Select
              className="md:col-span-2"
              value={priceBand}
              onChange={setPriceBand}
              label="Price"
              options={[
                { v: "all", l: "Any price" },
                { v: "u3", l: "Under ₹3L" },
                { v: "3to7", l: "₹3L – ₹7L" },
                { v: "7to12", l: "₹7L – ₹12L" },
                { v: "o12", l: "Above ₹12L" },
              ]}
            />
            <Select
              className="md:col-span-2"
              value={sort}
              onChange={setSort}
              label="Sort"
              options={[
                { v: "featured", l: "Featured" },
                { v: "price-asc", l: "Price: low to high" },
                { v: "price-desc", l: "Price: high to low" },
                { v: "name", l: "Name: A–Z" },
              ]}
            />
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {vehicles.length} vehicles
          </div>
        </div>
      </section>

      {/* GRID */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-12">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              No vehicles match your filters. Try clearing them.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((v) => (
                <VehicleCard key={v.id} v={v} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
              R
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold">RAGHAVENDRA AUTO FINANCE</div>
              <div className="text-xs text-muted-foreground">
                Trusted Auto Sales & Vehicle Finance Services.
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Raghavendra Auto Finance. Jangaon, Telangana.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
  options,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: { v: string; l: string }[];
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}

function VehicleCard({ v }: { v: Vehicle }) {
  const enquiryText = `Hi, I'm interested in the ${v.name} (${formatINR(v.price)}). Please share more details.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(enquiryText)}`;
  const mailtoUrl = `mailto:srinu9908459@gmail.com?subject=${encodeURIComponent(
    `Enquiry: ${v.name}`,
  )}&body=${encodeURIComponent(enquiryText)}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={v.image}
          alt={v.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          {v.inStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              <CheckCircle2 className="h-3 w-3" /> In stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              <XCircle className="h-3 w-3" /> Out of stock
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
          {v.brand}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{v.name}</h3>
          <div className="whitespace-nowrap text-lg font-bold text-primary">
            {formatINR(v.price)}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <Spec label="Engine" value={v.engine} />
          <Spec label="Fuel" value={v.fuel} />
          <Spec label="Transmission" value={v.transmission} />
          <Spec label="Seating" value={`${v.seating} seater`} />
        </dl>

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

        <div className="mt-6 grid grid-cols-3 gap-2">
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Phone className="h-3.5 w-3.5" /> Call
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
          <a
            href={mailtoUrl}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2.5 text-xs font-semibold transition hover:bg-secondary"
          >
            <Mail className="h-3.5 w-3.5" /> Enquire
          </a>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium">{value}</div>
    </div>
  );
}
