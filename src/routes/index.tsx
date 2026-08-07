import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Phone,
  Mail,
  MapPin,
  Car,
  ArrowRightLeft,
  FileText,
  Banknote,
  ShieldCheck,
  Clock,
  Users,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import type { LinkProps } from "@tanstack/react-router";
import heroImg from "@/assets/hero-vehicles.jpg";
import { EmiCalculator } from "@/components/EmiCalculator";
import { ReviewsSection } from "@/components/ReviewsSection";
import { VehicleCard } from "@/components/VehicleCard";
import { FAQS, vehiclesQuery } from "@/lib/catalog";
import { ADDRESS_LINES, EMAIL, MAP_EMBED, PHONE, PHONE_TEL, WHATSAPP_URL } from "@/lib/site";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Raghavendra Auto Finance — Trusted Auto Sales & Vehicle Finance in Jangaon" },
      {
        name: "description",
        content:
          "Buy, sell, and exchange auto rickshaws and cars in Jangaon. Finance against registered vehicle documents with fast, transparent processing.",
      },
      { property: "og:title", content: "Raghavendra Auto Finance" },
      {
        property: "og:description",
        content: "Trusted auto sales and vehicle finance services in Jangaon, Telangana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

type Service = {
  icon: typeof Car;
  title: string;
  desc: string;
  to?: LinkProps["to"];
};

const services: Service[] = [
  {
    icon: Car,
    title: "Auto Rickshaw Sales",
    desc: "Buy and sell quality auto rickshaws with confidence and clear paperwork.",
    to: "/auto-rickshaw-sales",
  },
  {
    icon: Car,
    title: "Car Sales",
    desc: "Curated pre-owned cars, inspected and priced fairly for local buyers.",
    to: "/car-sales",
  },
  {
    icon: ArrowRightLeft,
    title: "Vehicle Exchange",
    desc: "Trade in your existing auto or car and upgrade with minimal hassle.",
  },
  {
    icon: FileText,
    title: "Documentation Support",
    desc: "End-to-end assistance with RC transfer, insurance, and vehicle paperwork.",
  },
  {
    icon: Banknote,
    title: "Finance Against Vehicle Documents",
    desc: "Unlock value from your registered auto or car documents — fast approvals, clear terms.",
    to: "/finance",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Local Service",
    desc: "Rooted in Jangaon. Real people, honest advice, and long-term relationships.",
  },
];

const whys = [
  { icon: Clock, title: "Fast Processing", desc: "Same-day movement on most files." },
  {
    icon: ShieldCheck,
    title: "Transparent Documentation",
    desc: "No hidden clauses. Every line explained.",
  },
  { icon: Users, title: "Trusted Locally", desc: "Serving Jangaon families and drivers with care." },
];

function Index() {
  const { data: vehicles = [] } = useQuery(vehiclesQuery());
  const featured = vehicles.filter((v) => v.featured).slice(0, 3);
  const showcase = featured.length > 0 ? featured : vehicles.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Auto rickshaw and car"
            width={1920}
            height={1200}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-24 md:py-32 lg:grid-cols-2 lg:py-40">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <MapPin className="h-3 w-3" /> Jangaon, Telangana
            </div>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Trusted Auto Sales <br />
              <span className="text-muted-foreground">&amp; Vehicle Finance.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Raghavendra Auto Finance helps you buy, sell, and finance auto rickshaws and cars in
              Jangaon — with fast processing and transparent documentation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Get in touch <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-card"
              >
                Explore services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="border-t border-border/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              About
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              A local name you can trust.
            </h2>
          </div>
          <div className="lg:col-span-2">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Raghavendra Auto Finance is a trusted automobile business based in Jangaon. We
              specialize in the sale, purchase, and exchange of auto rickshaws and cars, along with
              complete documentation support and finance against registered vehicle documents. Our
              promise is simple — fast processing, transparent paperwork, and honest service that our
              community has relied on for years.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                What we do
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Services built around your vehicle.
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              From sales to finance against your registered vehicle documents, we cover every step
              under one roof.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const content = (
                <>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  {s.to && (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      {s.to === "/finance" ? "Check eligibility" : "View inventory"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </>
              );
              return s.to ? (
                <Link
                  key={s.title}
                  to={s.to}
                  className="group flex flex-col gap-4 bg-card p-8 text-left transition hover:bg-card/70"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={s.title}
                  className="group flex flex-col gap-4 bg-card p-8 transition hover:bg-card/70"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED INVENTORY */}
      {showcase.length > 0 && (
        <section id="inventory" className="border-t border-border/60">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Featured stock
                </div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Available right now.
                </h2>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/auto-rickshaw-sales"
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-secondary"
                >
                  All autos
                </Link>
                <Link
                  to="/car-sales"
                  className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-secondary"
                >
                  All cars
                </Link>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {showcase.map((v) => (
                <VehicleCard key={v.id} v={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY US */}
      <section id="why" className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Why choose us
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Straightforward. Local. Reliable.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {whys.map((w) => (
              <div key={w.title} className="rounded-2xl border border-border bg-card p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <w.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMI + FINANCE */}
      <section id="emi" className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-6 py-24 lg:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Plan your purchase
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Know your EMI before you commit.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Use the calculator to see an indicative monthly instalment, then check your eligibility
              for finance against your registered vehicle documents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/finance"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Check eligibility <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
            <p className="mt-4 max-w-lg text-xs text-muted-foreground">
              We offer finance only against registered vehicle documents — not personal or general
              purpose loans.
            </p>
          </div>
          <EmiCalculator price={500000} />
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection />

      {/* FAQ */}
      <section id="faq" className="border-t border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              FAQ
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Questions people ask us.
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-12">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Contact
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Visit us or give us a call.
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                We're happy to answer any questions about vehicle sales, exchange, or finance against
                your registered vehicle documents.
              </p>

              <div className="mt-10 space-y-5">
                <a
                  href={PHONE_TEL}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:bg-card/70"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Phone
                    </div>
                    <div className="mt-1 font-semibold">{PHONE}</div>
                  </div>
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:bg-card/70"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      WhatsApp
                    </div>
                    <div className="mt-1 font-semibold">Chat on WhatsApp</div>
                  </div>
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:bg-card/70"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Email
                    </div>
                    <div className="mt-1 break-all font-semibold">{EMAIL}</div>
                  </div>
                </a>
                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Location
                    </div>
                    <div className="mt-1 font-semibold leading-relaxed">
                      {ADDRESS_LINES.map((l) => (
                        <div key={l}>{l}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title="Raghavendra Auto Finance location"
                src={MAP_EMBED}
                className="h-full min-h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
