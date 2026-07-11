import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Users, Globe } from "lucide-react";

interface StepAudienceProps {
  prepTarget: string;
  onChange: (value: string) => void;
  errors: Record<string, string>;
}

export function StepAudience({ prepTarget, onChange, errors }: StepAudienceProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2.5 mb-1.5">
        <User className="size-5 text-cyan-400 shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">Who are you preparing for?</h3>
      </div>

      <RadioGroup
        value={prepTarget}
        onValueChange={onChange}
        className="grid gap-3"
      >
        {[
          { id: "myself", label: "Myself", description: "Personal readiness plan focused on individual safety.", icon: User },
          { id: "family", label: "Family", description: "Plan incorporating dependents, pets, and shared resources.", icon: Users },
          { id: "community", label: "Community", description: "Disaster protocol for housing societies, floors, or neighborhoods.", icon: Globe },
        ].map((option) => {
          const Icon = option.icon;
          const isSelected = prepTarget === option.id;
          return (
            <div
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 focus-within:ring-2 focus-within:ring-cyan-500/30 ${
                isSelected
                  ? "bg-cyan-950/15 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                  : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/40"
              }`}
            >
              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={option.id} className="text-sm font-bold text-slate-100 flex items-center gap-2 cursor-pointer">
                  <Icon className={`size-4 ${isSelected ? "text-cyan-400" : "text-slate-400"}`} />
                  {option.label}
                </Label>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{option.description}</p>
              </div>
            </div>
          );
        })}
      </RadioGroup>
      {errors.prepTarget && (
        <p role="alert" className="text-[11px] text-red-400 mt-2 font-semibold">
          {errors.prepTarget}
        </p>
      )}
    </div>
  );
}
