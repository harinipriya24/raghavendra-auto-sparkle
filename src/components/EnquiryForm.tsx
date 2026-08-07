import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { EnquiryKind } from "@/lib/catalog";

const base = {
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(160).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
};

const schema = z.object({
  ...base,
  preferred_date: z.string().optional().or(z.literal("")),
  monthly_income: z.string().optional().or(z.literal("")),
  employment_type: z.string().optional().or(z.literal("")),
  loan_amount: z.string().optional().or(z.literal("")),
});

type Props = {
  kind: EnquiryKind;
  vehicleId?: string;
  vehicleName?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
};

export function EnquiryForm({
  kind,
  vehicleId,
  vehicleName,
  title,
  description,
  submitLabel,
}: Props) {
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (form: FormData) => {
      const raw = Object.fromEntries(form.entries()) as Record<string, string>;
      const parsed = schema.safeParse(raw);
      if (!parsed.success) {
        const next: Record<string, string> = {};
        for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
        setErrors(next);
        throw new Error("validation");
      }
      setErrors({});
      const v = parsed.data;
      const { error } = await supabase.from("enquiries").insert({
        kind,
        vehicle_id: vehicleId ?? null,
        vehicle_name: vehicleName ?? null,
        name: v.name,
        phone: v.phone,
        email: v.email || null,
        city: v.city || null,
        message: v.message || null,
        preferred_date: v.preferred_date || null,
        monthly_income: v.monthly_income ? Number(v.monthly_income) : null,
        employment_type: v.employment_type || null,
        loan_amount: v.loan_amount ? Number(v.loan_amount) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setDone(true);
      toast.success("Thank you! We will call you back shortly.");
    },
    onError: (e: Error) => {
      if (e.message !== "validation") toast.error("Could not submit right now. Please call us instead.");
    },
  });

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
        <h3 className="mt-4 text-xl font-bold">Request received</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our team will contact you on the number you provided. For anything urgent, call 9908459309.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-5 rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:bg-secondary"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(new FormData(e.currentTarget));
      }}
      className="rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      {title && <h3 className="text-xl font-bold tracking-tight">{title}</h3>}
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input name="name" label="Full name" required error={errors["name"]} />
        <Input name="phone" label="Phone number" required error={errors["phone"]} inputMode="tel" />
        <Input name="email" label="Email (optional)" type="email" error={errors["email"]} />
        <Input name="city" label="City / village" error={errors["city"]} />

        {kind === "booking" && (
          <Input name="preferred_date" label="Preferred visit date" type="date" />
        )}

        {kind === "finance" && (
          <>
            <Input name="loan_amount" label="Amount required (₹)" inputMode="numeric" />
            <Input name="monthly_income" label="Monthly income (₹)" inputMode="numeric" />
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Employment type
              </span>
              <select
                name="employment_type"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
              >
                <option value="Self-employed">Self-employed</option>
                <option value="Salaried">Salaried</option>
                <option value="Driver / Operator">Driver / Operator</option>
                <option value="Business owner">Business owner</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </>
        )}

        <label className="block sm:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Message
          </span>
          <textarea
            name="message"
            rows={3}
            defaultValue={vehicleName ? `I'm interested in the ${vehicleName}.` : ""}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitLabel ?? "Submit request"}
      </button>
      <p className="mt-3 text-xs text-muted-foreground">
        Finance is provided only against registered vehicle documents.
      </p>
    </form>
  );
}

function Input({
  name,
  label,
  error,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; error?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        {...rest}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
