import { createFileRoute } from "@tanstack/react-router";
import { VehicleListingPage } from "@/components/VehicleListingPage";
import { autoRickshaws } from "@/data/vehicles";

export const Route = createFileRoute("/auto-rickshaw-sales")({
  component: AutoRickshawSales,
  head: () => ({
    meta: [
      { title: "Auto Rickshaw Sales in Jangaon — Raghavendra Auto Finance" },
      {
        name: "description",
        content:
          "Buy and sell quality auto rickshaws in Jangaon. Browse petrol, diesel, CNG and electric autos with transparent documentation.",
      },
      { property: "og:title", content: "Auto Rickshaw Sales — Raghavendra Auto Finance" },
      {
        property: "og:description",
        content:
          "Curated auto rickshaws for sale in Jangaon — inspected, priced fairly, and ready to drive.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

function AutoRickshawSales() {
  return (
    <VehicleListingPage
      eyebrow="Auto Rickshaw Sales"
      title="Autos, inspected and ready to drive."
      intro="Browse our latest auto rickshaws — petrol, diesel, CNG and electric — all with transparent paperwork and honest pricing."
      vehicles={autoRickshaws}
    />
  );
}
