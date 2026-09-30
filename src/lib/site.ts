export const PHONE = "9908459309";
export const PHONE_TEL = "tel:+919908459309";
export const WHATSAPP_URL = "https://wa.me/919908459309";
export const EMAIL = "srinu9908459@gmail.com";
export const ADDRESS_LINES = ["Jyothi Nagar Colony", "Jangaon, Telangana, India"];
export const MAP_EMBED =
  "https://www.google.com/maps?q=Jyothi+Nagar+Colony,+Jangaon,+Telangana,+India&output=embed";

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const formatShortINR = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return formatINR(n);
};

/** Standard reducing-balance EMI. */
export function calcEmi(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return { emi: 0, totalInterest: 0, total: 0 };
  const r = annualRate / 12 / 100;
  const emi =
    r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
  const total = emi * months;
  return { emi, totalInterest: total - principal, total };
}

export const mailtoFor = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const whatsappFor = (text: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;

const SWATCHES: Record<string, string> = {
  white: "#f5f5f4", black: "#111111", red: "#c62828", blue: "#1e4fa3", silver: "#c0c0c0",
  grey: "#6b7280", gray: "#6b7280", yellow: "#f2c200", green: "#2e7d32", orange: "#ef6c00",
  brown: "#6d4c41", maroon: "#7b1e2b", beige: "#d8c7a3", gold: "#c9a227", teal: "#0f766e",
};
/** Best-effort swatch colour from a colour name like "Pearl White". */
export const swatchFor = (name: string) => {
  const n = name.toLowerCase();
  const key = Object.keys(SWATCHES).find((k) => n.includes(k));
  return key ? SWATCHES[key] : "#9ca3af";
};
