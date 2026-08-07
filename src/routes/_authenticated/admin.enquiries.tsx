import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Phone, Mail, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/site";
import type { EnquiryKind } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  component: AdminEnquiries,
});

const KINDS: { v: "all" | EnquiryKind; l: string }[] = [
  { v: "all", l: "All" },
  { v: "enquiry", l: "Enquiries" },
  { v: "booking", l: "Bookings" },
  { v: "finance", l: "Finance requests" },
];

const STATUSES = ["new", "contacted", "in progress", "closed"];

function AdminEnquiries() {
  const qc = useQueryClient();
  const [kind, setKind] = useState<"all" | EnquiryKind>("all");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-enquiries"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("enquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = kind === "all" ? rows : rows.filter((r) => r.kind === kind);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Enquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Call-back requests, visit bookings and finance eligibility submissions.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.v}
            onClick={() => setKind(k.v)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              kind === k.v ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-secondary"
            }`}
          >
            {k.l}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No submissions yet.
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {r.kind}
                    </span>
                    <h3 className="font-semibold">{r.name}</h3>
                    {r.city && <span className="text-xs text-muted-foreground">{r.city}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                      <Phone className="h-3.5 w-3.5" /> {r.phone}
                    </a>
                    {r.email && (
                      <a
                        href={`mailto:${r.email}`}
                        className="inline-flex items-center gap-1.5 break-all hover:text-foreground"
                      >
                        <Mail className="h-3.5 w-3.5" /> {r.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={r.status}
                    onChange={(e) => update.mutate({ id: r.id, status: e.target.value })}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (confirm("Delete this submission?")) remove.mutate(r.id);
                    }}
                    aria-label="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-destructive transition hover:bg-secondary"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {r.vehicle_name && <Info label="Vehicle" value={r.vehicle_name} />}
                {r.preferred_date && <Info label="Preferred date" value={r.preferred_date} />}
                {r.loan_amount ? <Info label="Amount required" value={formatINR(r.loan_amount)} /> : null}
                {r.monthly_income ? (
                  <Info label="Monthly income" value={formatINR(r.monthly_income)} />
                ) : null}
                {r.employment_type && <Info label="Employment" value={r.employment_type} />}
                <Info label="Received" value={new Date(r.created_at).toLocaleString("en-IN")} />
              </div>

              {r.message && (
                <p className="mt-4 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                  {r.message}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
