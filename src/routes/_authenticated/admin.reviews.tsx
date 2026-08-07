import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, EyeOff, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Stars } from "@/components/ReviewsSection";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const setApproved = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review deleted");
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Approve reviews to publish them on the website.
      </p>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            No reviews yet.
          </div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{r.name}</span>
                    {r.city && <span className="text-xs text-muted-foreground">{r.city}</span>}
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        r.approved
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {r.approved ? "Published" : "Pending"}
                    </span>
                  </div>
                  <div className="mt-2">
                    <Stars value={r.rating} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setApproved.mutate({ id: r.id, approved: !r.approved })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:bg-secondary"
                  >
                    {r.approved ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Unpublish
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" /> Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this review?")) remove.mutate(r.id);
                    }}
                    aria-label="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-destructive transition hover:bg-secondary"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
              <div className="mt-3 text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleString("en-IN")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
