import { createFileRoute } from "@tanstack/react-router";
import { VehicleListingPage } from "@/components/VehicleListingPage";

export const Route = createFileRoute("/auto-rickshaw-sales")({
  component: AutoSales,
  head: () => ({
    meta: [
      { title: "Auto Rickshaw Sales in Jangaon — Raghavendra Auto Finance" },
      {
        name: "description",
        content:
          "Buy and sell auto rickshaws in Jangaon, Telangana. CNG, diesel, petrol and electric autos with transparent pricing, documentation support and finance help.",
      },
      { property: "og:title", content: "Auto Rickshaw Sales — Raghavendra Auto Finance" },
      {
        property: "og:description",
        content:
          "Browse auto rickshaws for sale in Jangaon with clear paperwork and finance against registered vehicle documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AutoSales() {
  return (
    <VehicleListingPage
      eyebrow="Auto Rickshaw Sales"
      title="Auto rickshaws built for daily earning."
      intro="Passenger and cargo autos across CNG, diesel, petrol and electric. Every vehicle is checked, fairly priced and comes with complete documentation support."
      category="auto"
    />
  );
}
