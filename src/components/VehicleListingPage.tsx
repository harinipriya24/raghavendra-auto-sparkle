import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowLeft, MapPin, SlidersHorizontal, GitCompareArrows } from "lucide-react";
import { vehiclesQuery, type VehicleCategory } from "@/lib/catalog";
import { VehicleCard } from "@/components/VehicleCard";
import { useCompare } from "@/hooks/useCompare";

type Props = {
  title: string;
  eyebrow: string;
  intro: string;
  category: VehicleCategory;
};

export function VehicleListingPage({ title, eyebrow, intro, category }: Props) {
  const { data: vehicles = [], isLoading } = useQuery(vehiclesQuery(category));
  const { ids } = useCompare();

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [seating, setSeating] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [priceBand, setPriceBand] = useState("all");
  const [sort, setSort] = useState("featured");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const brands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand))).sort(),
    [vehicles],
  );
  const fuels = useMemo(() => Array.from(new Set(vehicles.map((v) => v.fuel))).sort(), [vehicles]);
  const seats = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.seating))).sort((a, b) => a - b),
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
      const matchesPrice =
        priceBand === "all" ||
        (priceBand === "u3" && v.price < 300000) ||
        (priceBand === "3to7" && v.price >= 300000 && v.price < 700000) ||
        (priceBand === "7to12" && v.price >= 700000 && v.price < 1200000) ||
        (priceBand === "o12" && v.price >= 1200000);
      return (
        matchesQ &&
        matchesPrice &&
        (brand === "all" || v.brand === brand) &&
        (fuel === "all" || v.fuel === fuel) &&
        (transmission === "all" || v.transmission === transmission) &&
        (seating === "all" || String(v.seating) === seating) &&
        (availability === "all" ||
          (availability === "in" ? v.in_stock : !v.in_stock))
      );
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [vehicles, query, brand, fuel, transmission, seating, availability, priceBand, sort]);

  const clearAll = () => {
    setQuery("");
    setBrand("all");
    setFuel("all");
    setTransmission("all");
    setSeating("all");
    setAvailability("all");
    setPriceBand("all");
    setSort("featured");
  };

  return (
    <>
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
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{intro}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> Jangaon, Telangana
          </div>
        </div>
      </section>

      <section className="sticky top-[73px] z-30 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="relative md:col-span-5">
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
            <button
              onClick={() => setShowAdvanced((s) => !s)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-secondary md:col-span-1"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="md:hidden">More filters</span>
            </button>
          </div>

          {showAdvanced && (
            <div className="mt-3 grid gap-3 md:grid-cols-12">
              <Select
                className="md:col-span-3"
                value={fuel}
                onChange={setFuel}
                label="Fuel"
                options={[{ v: "all", l: "All fuel types" }, ...fuels.map((f) => ({ v: f, l: f }))]}
              />
              <Select
                className="md:col-span-3"
                value={transmission}
                onChange={setTransmission}
                label="Transmission"
                options={[
                  { v: "all", l: "Any transmission" },
                  { v: "Manual", l: "Manual" },
                  { v: "Automatic", l: "Automatic" },
                ]}
              />
              <Select
                className="md:col-span-3"
                value={seating}
                onChange={setSeating}
                label="Seating"
                options={[
                  { v: "all", l: "Any seating" },
                  ...seats.map((s) => ({ v: String(s), l: `${s} seater` })),
                ]}
              />
              <Select
                className="md:col-span-3"
                value={availability}
                onChange={setAvailability}
                label="Availability"
                options={[
                  { v: "all", l: "Any availability" },
                  { v: "in", l: "In stock" },
                  { v: "out", l: "Out of stock" },
                ]}
              />
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>
              Showing {filtered.length} of {vehicles.length} vehicles
            </span>
            <button onClick={clearAll} className="font-semibold underline-offset-2 hover:underline">
              Clear filters
            </button>
            {ids.length > 0 && (
              <Link
                to="/compare"
                className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-2 hover:underline"
              >
                <GitCompareArrows className="h-3.5 w-3.5" /> Compare ({ids.length})
              </Link>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-12">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl border border-border bg-card" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
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
    </>
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
