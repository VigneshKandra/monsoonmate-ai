import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Home } from "lucide-react";

interface StepHousingProps {
  houseType: string;
  onChange: (value: string) => void;
  errors: Record<string, string>;
}

export function StepHousing({ houseType, onChange, errors }: StepHousingProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2.5 mb-1.5">
        <Home className="size-5 text-cyan-400 shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">House Type</h3>
      </div>

      <RadioGroup
        value={houseType}
        onValueChange={onChange}
        className="grid gap-3"
      >
        {[
          { id: "apartment", label: "Apartment / High-rise Complex" },
          { id: "independent", label: "Independent House / Villa" },
          { id: "village", label: "Village / Semi-permanent House" },
          { id: "flood", label: "Located in a Flood-prone Lowland Area" },
          { id: "other", label: "Other housing type" },
        ].map((option) => {
          const isSelected = houseType === option.id;
          return (
            <div
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-cyan-500/30 ${
                isSelected
                  ? "bg-cyan-950/15 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.03)]"
                  : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/40"
              }`}
            >
              <Label htmlFor={option.id} className="text-sm font-semibold text-slate-200 cursor-pointer flex-1 select-none">
                {option.label}
              </Label>
              <RadioGroupItem value={option.id} id={option.id} className="shrink-0 ml-4 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-cyan-500/50" />
            </div>
          );
        })}
      </RadioGroup>
      {errors.houseType && (
        <p role="alert" className="text-[11px] text-red-400 mt-2 font-semibold">
          {errors.houseType}
        </p>
      )}
    </div>
  );
}
