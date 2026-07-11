import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";

interface StepHouseholdProps {
  householdInfo: string[];
  onChange: (value: string, checked: boolean) => void;
  errors: Record<string, string>;
}

export function StepHousehold({ householdInfo, onChange, errors }: StepHouseholdProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2.5 mb-1.5">
        <Users className="size-5 text-cyan-400 shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">Household Information</h3>
      </div>

      <div className="grid gap-2.5">
        {[
          { id: "children", label: "Children (Under 12 years)" },
          { id: "senior", label: "Senior Citizens (Above 60 years)" },
          { id: "pregnant", label: "Pregnant Women" },
          { id: "disabilities", label: "People with Disabilities / Mobility issues" },
          { id: "pets", label: "Pets (Dogs, Cats, Birds, etc.)" },
          { id: "none", label: "None of the above" },
        ].map((option) => {
          const isChecked = householdInfo.includes(option.id);
          return (
            <div
              key={option.id}
              onClick={() => onChange(option.id, !isChecked)}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-cyan-500/30 ${
                isChecked
                  ? "bg-cyan-950/15 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.03)]"
                  : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/40"
              }`}
            >
              <Label htmlFor={option.id} className="text-sm font-semibold text-slate-200 cursor-pointer flex-1 py-0.5 select-none">
                {option.label}
              </Label>
              <Checkbox
                id={option.id}
                checked={isChecked}
                onCheckedChange={(checked) => onChange(option.id, !!checked)}
                className="border-slate-700 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 shrink-0 ml-4 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
              />
            </div>
          );
        })}
      </div>
      {errors.householdInfo && (
        <p role="alert" className="text-[11px] text-red-400 mt-2 font-semibold">
          {errors.householdInfo}
        </p>
      )}
    </div>
  );
}
