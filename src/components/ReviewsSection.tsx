import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { approvedReviewsQuery } from "@/lib/catalog";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  comment: z.string().trim().min(10, "Please write at least a few words").max(800),
  rating: z.coerce.number().min(1).max(5),
});

export function ReviewsSection() {
  const { data: reviews = [] } = useQuery(approvedReviewsQuery());
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (form: FormData) => {
      const parsed = schema.safeParse({
        ...Object.fromEntries(form.entries()),
        rating,
      });
      if (!parsed.success) {
        const next: Record<string, string> = {};
        for (const i of parsed.error.issues) next[String(i.path[0])] = i.message;
        setErrors(next);
        throw new Error("validation");
      }
      setErrors({});
      const { error } = await supabase.from("reviews").insert({
        name: parsed.data.name,
        city: parsed.data.city || null,
        comment: parsed.data.comment,
        rating: parsed.data.rating,
        approved: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Thanks! Your review will appear once we approve it.");
    },
    onError: (e: Error) => {
      if (e.message !== "validation") toast.error("Could not submit your review right now.");
    },
  });

  return (
    <section id="reviews" className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Customer reviews
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            What our customers say.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground lg:col-span-3">
              No reviews published yet — be the first to share your experience.
            </div>
          ) : (
            reviews.slice(0, 6).map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-8">
                <Stars value={r.rating} />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">“{r.comment}”</p>
                <div className="mt-5 text-sm font-semibold">{r.name}</div>
                {r.city && <div className="text-xs text-muted-foreground">{r.city}</div>}
              </div>
            ))
          )}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
          {submitted ? (
            <div className="text-center">
              <h3 className="text-lg font-bold">Thank you for your review</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                It will be published on the website once our team approves it.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate(new FormData(e.currentTarget));
              }}
            >
              <h3 className="text-lg font-bold tracking-tight">Leave a review</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Reviews are published after a quick check by our team.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your name
                  </span>
                  <input
                    name="name"
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  {errors["name"] && (
                    <span className="mt-1 block text-xs text-destructive">{errors["name"]}</span>
                  )}
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    City / village
                  </span>
                  <input
                    name="city"
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </label>
                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Rating
                  </span>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-6 w-6 ${
                            n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your experience
                  </span>
                  <textarea
                    name="comment"
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  {errors["comment"] && (
                    <span className="mt-1 block text-xs text-destructive">{errors["comment"]}</span>
                  )}
                </label>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit review
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-4 w-4 ${n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
}
