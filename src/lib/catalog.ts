import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import heroVehicles from "@/assets/hero-vehicles.jpg";
import bajajAuto from "@/assets/bajaj-auto-rickshaw.jpg";
import piaggioAuto from "@/assets/piaggio-auto-rickshaw.jpg";
import electricAuto from "@/assets/electric-auto-rickshaw.jpg";
import tvsAuto from "@/assets/tvs-auto-rickshaw.jpg";
import marutiSwift from "@/assets/maruti-swift-vxi.jpg";
import hyundaiCreta from "@/assets/hyundai-creta-sx.jpg";
import tataNexon from "@/assets/tata-nexon-ev.jpg";
import hondaCity from "@/assets/honda-city-zx.jpg";
import mahindraBolero from "@/assets/mahindra-bolero.jpg";
import marutiWagonR from "@/assets/maruti-wagonr-cng.jpg";

export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];
export type VehicleCategory = Database["public"]["Enums"]["vehicle_category"];
export type EnquiryKind = Database["public"]["Enums"]["enquiry_kind"];

export const FALLBACK_IMAGE = heroVehicles;

const replacementImages: Record<string, string> = {
  "https://images.unsplash.com/photo-1580494767050-8b3a2f0e0b0f?auto=format&fit=crop&w=1400&q=80":
    bajajAuto,
  "https://images.unsplash.com/photo-1519055548599-6d4d129508c4?auto=format&fit=crop&w=1400&q=80":
    piaggioAuto,
  "https://images.unsplash.com/photo-1617196701539-e88ae67f0f6f?auto=format&fit=crop&w=1400&q=80":
    electricAuto,
  "https://images.unsplash.com/photo-1597007519071-c1a5aebc4a44?auto=format&fit=crop&w=1400&q=80":
    tvsAuto,
};

const vehiclePhotos: Record<string, string> = {
  "Maruti Suzuki Swift VXi": marutiSwift,
  "Hyundai Creta SX": hyundaiCreta,
  "Tata Nexon EV": tataNexon,
  "Honda City ZX": hondaCity,
  "Mahindra Bolero": mahindraBolero,
  "Maruti Suzuki WagonR CNG": marutiWagonR,
};

export const vehicleImages = (v: Pick<Vehicle, "images" | "name">) => {
  const vehiclePhoto = vehiclePhotos[v.name];
  if (vehiclePhoto) return [vehiclePhoto];

  return v.images && v.images.length > 0
    ? v.images.map((image) => replacementImages[image] ?? image)
    : [FALLBACK_IMAGE];
};

export const vehiclesQuery = (category?: VehicleCategory) =>
  queryOptions({
    queryKey: ["vehicles", category ?? "all"],
    queryFn: async () => {
      let q = supabase.from("vehicles").select("*");
      if (category) q = q.eq("category", category);
      const { data, error } = await q
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const vehicleQuery = (id: string) =>
  queryOptions({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const vehiclesByIdsQuery = (ids: string[]) =>
  queryOptions({
    queryKey: ["vehicles-by-ids", [...ids].sort().join(",")],
    queryFn: async () => {
      if (ids.length === 0) return [] as Vehicle[];
      const { data, error } = await supabase.from("vehicles").select("*").in("id", ids);
      if (error) throw error;
      return data;
    },
  });

export const approvedReviewsQuery = () =>
  queryOptions({
    queryKey: ["reviews", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const FAQS = [
  {
    q: "What documents do I need to buy a vehicle?",
    a: "A valid ID proof (Aadhaar/PAN), address proof, and passport-size photos. We handle the RC transfer, insurance and all remaining paperwork for you.",
  },
  {
    q: "How does finance against registered vehicle documents work?",
    a: "If you own an auto rickshaw or car with a registered RC in your name, we can arrange finance against those vehicle documents. You keep using your vehicle, and the amount depends on the vehicle's value and condition.",
  },
  {
    q: "How long does approval take?",
    a: "Most files move the same day. Once your vehicle documents are verified, processing is usually completed within 24–48 hours.",
  },
  {
    q: "Can I exchange my current vehicle?",
    a: "Yes. Bring your auto or car to our Jangaon office for a free valuation and we will adjust the value against your new purchase.",
  },
  {
    q: "Do you charge for a valuation or consultation?",
    a: "No. Valuation, consultation and documentation guidance are completely free.",
  },
  {
    q: "Is the EMI shown on the website final?",
    a: "The EMI calculator gives an indicative figure only. Your final EMI depends on the down payment, tenure and the interest rate applicable to your file.",
  },
];
