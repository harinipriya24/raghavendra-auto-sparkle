import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import { vehicleImages, type Vehicle, type VehicleCategory } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminVehicles,
});

type Draft = {
  id?: string;
  category: VehicleCategory;
  name: string;
  brand: string;
  price: string;
  engine: string;
  seating: string;
  transmission: string;
  fuel: string;
  colors: string;
  description: string;
  in_stock: boolean;
  featured: boolean;
  sort_order: string;
  images: string[];
};

const emptyDraft: Draft = {
  category: "car",
  name: "",
  brand: "",
  price: "",
  engine: "",
  seating: "5",
  transmission: "Manual",
  fuel: "Petrol",
  colors: "",
  description: "",
  in_stock: true,
  featured: false,
  sort_order: "0",
  images: [],
};

const toDraft = (v: Vehicle): Draft => ({
  id: v.id,
  category: v.category,
  name: v.name,
  brand: v.brand,
  price: String(v.price),
  engine: v.engine,
  seating: String(v.seating),
  transmission: v.transmission,
  fuel: v.fuel,
  colors: v.colors.join(", "),
  description: v.description,
  in_stock: v.in_stock,
  featured: v.featured,
  sort_order: String(v.sort_order),
  images: v.images ?? [],
});

function AdminVehicles() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("category")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        category: d.category,
        name: d.name.trim(),
        brand: d.brand.trim(),
        price: Number(d.price) || 0,
        engine: d.engine.trim(),
        seating: Number(d.seating) || 4,
        transmission: d.transmission,
        fuel: d.fuel,
        colors: d.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        description: d.description.trim(),
        in_stock: d.in_stock,
        featured: d.featured,
        sort_order: Number(d.sort_order) || 0,
        images: d.images,
      };
      if (!payload.name || !payload.brand) throw new Error("Name and brand are required");
      const { error } = d.id
        ? await supabase.from("vehicles").update(payload).eq("id", d.id)
        : await supabase.from("vehicles").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Vehicle saved");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin-vehicles"] });
      qc.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Vehicle deleted");
      qc.invalidateQueries({ queryKey: ["admin-vehicles"] });
      qc.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const uploadImage = async (file: File) => {
    if (!draft) return;
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from("vehicle-images").upload(path, file);
      if (error) throw error;
      const { data, error: signErr } = await supabase.storage
        .from("vehicle-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
      if (signErr) throw signErr;
      setDraft({ ...draft, images: [...draft.images, data.signedUrl] });
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage inventory, prices, images and availability.
          </p>
        </div>
        <button
          onClick={() => setDraft({ ...emptyDraft })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add vehicle
        </button>
      </div>

      {draft && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{draft.id ? "Edit vehicle" : "New vehicle"}</h2>
            <button onClick={() => setDraft(null)} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name">
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Brand">
              <input
                value={draft.brand}
                onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value as VehicleCategory })
                }
                className={inputCls}
              >
                <option value="auto">Auto rickshaw</option>
                <option value="car">Car</option>
              </select>
            </Field>
            <Field label="Price (₹)">
              <input
                inputMode="numeric"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Engine / Power">
              <input
                value={draft.engine}
                onChange={(e) => setDraft({ ...draft, engine: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Seating">
              <input
                inputMode="numeric"
                value={draft.seating}
                onChange={(e) => setDraft({ ...draft, seating: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Transmission">
              <select
                value={draft.transmission}
                onChange={(e) => setDraft({ ...draft, transmission: e.target.value })}
                className={inputCls}
              >
                <option>Manual</option>
                <option>Automatic</option>
              </select>
            </Field>
            <Field label="Fuel">
              <select
                value={draft.fuel}
                onChange={(e) => setDraft({ ...draft, fuel: e.target.value })}
                className={inputCls}
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>CNG</option>
                <option>Electric</option>
              </select>
            </Field>
            <Field label="Sort order">
              <input
                inputMode="numeric"
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Colours (comma separated)" className="sm:col-span-2">
              <input
                value={draft.colors}
                onChange={(e) => setDraft({ ...draft, colors: e.target.value })}
                className={inputCls}
              />
            </Field>
            <div className="flex items-end gap-5">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={draft.in_stock}
                  onChange={(e) => setDraft({ ...draft, in_stock: e.target.checked })}
                />
                In stock
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                />
                Featured
              </label>
            </div>
            <Field label="Description" className="sm:col-span-2 lg:col-span-3">
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Images
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {draft.images.map((url, i) => (
                <div key={url + i} className="relative">
                  <img src={url} alt="" className="h-20 w-28 rounded-lg border border-border object-cover" />
                  <button
                    onClick={() =>
                      setDraft({ ...draft, images: draft.images.filter((_, idx) => idx !== i) })
                    }
                    aria-label="Remove image"
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Upload
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void uploadImage(f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                placeholder="Or paste an image URL and press Add"
                className={inputCls}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val) {
                      setDraft({ ...draft, images: [...draft.images, val] });
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => save.mutate(draft)}
              disabled={save.isPending}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Save vehicle
            </button>
            <button
              onClick={() => setDraft(null)}
              className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Vehicle</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No vehicles yet.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="border-b border-border/60 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicleImages(v)[0]}
                        alt=""
                        className="h-12 w-16 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-semibold">{v.name}</div>
                        <div className="text-xs text-muted-foreground">{v.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{v.category === "auto" ? "Auto rickshaw" : "Car"}</td>
                  <td className="p-4 font-medium">{formatINR(v.price)}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        v.in_stock
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {v.in_stock ? "In stock" : "Out of stock"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setDraft(toDraft(v))}
                        aria-label="Edit"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition hover:bg-secondary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${v.name}?`)) remove.mutate(v.id);
                        }}
                        aria-label="Delete"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-destructive transition hover:bg-secondary"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputCls =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
