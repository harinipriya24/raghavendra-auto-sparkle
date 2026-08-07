import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2, ShieldCheck, Timer, BadgeIndianRupee } from "lucide-react";
import { EmiCalculator } from "@/components/EmiCalculator";
import { EnquiryForm } from "@/components/EnquiryForm";

export const Route = createFileRoute("/finance")({
  component: FinancePage,
  head: () => ({
    meta: [
      { title: "Finance Against Vehicle Documents in Jangaon — Raghavendra Auto Finance" },
      {
        name: "description",
        content:
          "Check your eligibility for finance against registered vehicle documents for autos and cars in Jangaon. Fast processing, transparent documentation.",
      },
      { property: "og:title", content: "Vehicle Document Finance — Raghavendra Auto Finance" },
      {
        property: "og:description",
        content:
          "Finance against registered auto and car documents in Jangaon, with fast processing and clear paperwork.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  {
    icon: FileCheck2,
    title: "Share your vehicle documents",
    body: "Bring the RC of your registered auto or car along with your ID and address proof.",
  },
  {
    icon: ShieldCheck,
    title: "Free valuation & verification",
    body: "We inspect the vehicle and verify documents in front of you — no hidden conditions.",
  },
  {
    icon: Timer,
    title: "Fast processing",
    body: "Most files are processed within 24–48 hours of document verification.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Clear terms",
    body: "Every charge, EMI and tenure is explained in writing before you sign.",
  },
];

function FinancePage() {
  return (
    <>
      <section className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Vehicle Document Finance
          </div>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Finance against your registered vehicle documents.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            If you own an auto rickshaw or a car registered in your name, we can arrange finance
            against those vehicle documents — with transparent paperwork and fast processing from our
            Jangaon office.
          </p>
          <p className="mt-3 max-w-2xl text-xs text-muted-foreground">
            We do not offer personal loans or general purpose loans. Finance is provided strictly
            against registered vehicle documents.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <s.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-2">
          <EnquiryForm
            kind="finance"
            title="Check your eligibility"
            description="Fill this in and our team will call you back with an indicative amount and the documents to bring."
            submitLabel="Check eligibility"
          />
          <EmiCalculator price={400000} compact />
        </div>
      </section>
    </>
  );
}
