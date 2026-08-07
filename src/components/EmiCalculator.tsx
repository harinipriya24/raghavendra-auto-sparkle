import { useMemo, useState } from "react";
import { calcEmi, formatINR } from "@/lib/site";

type Props = {
  price?: number;
  compact?: boolean;
};

export function EmiCalculator({ price = 500000, compact = false }: Props) {
  const [amount, setAmount] = useState(Math.max(50000, Math.round(price * 0.8)));
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(36);

  const { emi, totalInterest, total } = useMemo(
    () => calcEmi(amount, rate, months),
    [amount, rate, months],
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        EMI Calculator
      </div>
      <h3 className={`mt-2 font-bold tracking-tight ${compact ? "text-xl" : "text-2xl"}`}>
        Estimate your monthly instalment
      </h3>

      <div className="mt-6 space-y-6">
        <Field
          label="Loan amount"
          value={formatINR(amount)}
          min={25000}
          max={2500000}
          step={5000}
          current={amount}
          onChange={setAmount}
        />
        <Field
          label="Interest rate (p.a.)"
          value={`${rate.toFixed(1)}%`}
          min={6}
          max={26}
          step={0.5}
          current={rate}
          onChange={setRate}
        />
        <Field
          label="Tenure"
          value={`${months} months`}
          min={6}
          max={84}
          step={6}
          current={months}
          onChange={setMonths}
        />
      </div>

      <div className="mt-7 rounded-xl bg-secondary/60 p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Monthly EMI</div>
        <div className="mt-1 text-3xl font-bold text-primary">{formatINR(Math.round(emi))}</div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Total interest</div>
            <div className="font-semibold">{formatINR(Math.round(totalInterest))}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total payable</div>
            <div className="font-semibold">{formatINR(Math.round(total))}</div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Indicative figures only. Finance is offered against registered vehicle documents; final terms
        depend on your vehicle valuation and documentation.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-semibold text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
      />
    </label>
  );
}
