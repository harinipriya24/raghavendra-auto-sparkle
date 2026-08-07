import { createFileRoute } from "@tanstack/react-router";
import { VehicleListingPage } from "@/components/VehicleListingPage";

export const Route = createFileRoute("/car-sales")({
  component: CarSales,
  head: () => ({
    meta: [
      { title: "Car Sales in Jangaon — Raghavendra Auto Finance" },
      {
        name: "description",
        content:
          "Curated pre-owned and new cars for sale in Jangaon. Hatchbacks, sedans and SUVs — inspected, priced fairly, and finance-ready.",
      },
      { property: "og:title", content: "Car Sales — Raghavendra Auto Finance" },
      {
        property: "og:description",
        content:
          "Browse quality cars for sale in Jangaon with clear paperwork and finance support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function CarSales() {
  return (
    <VehicleListingPage
      eyebrow="Car Sales"
      title="Cars for every family and budget."
      intro="Hatchbacks, sedans and SUVs — carefully inspected and fairly priced. Ask us about finance against your registered vehicle documents."
      category="car"
    />
  );
}
