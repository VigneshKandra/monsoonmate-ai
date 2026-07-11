import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Languages } from "lucide-react";

interface StepLanguageProps {
  language: string;
  onChange: (value: string) => void;
  errors: Record<string, string>;
}

export function StepLanguage({ language, onChange, errors }: StepLanguageProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2.5 mb-1.5">
        <Languages className="size-5 text-cyan-400 shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">Preferred Language</h3>
      </div>

      <RadioGroup
        value={language}
        onValueChange={onChange}
        className="grid grid-cols-2 gap-3"
      >
        {[
          { id: "English", label: "English" },
          { id: "Hindi", label: "Hindi (हिन्दी)" },
          { id: "Kannada", label: "Kannada (ಕನ್ನಡ)" },
          { id: "Tamil", label: "Tamil (தமிழ்)" },
          { id: "Telugu", label: "Telugu (తెలుగు)" },
          { id: "Malayalam", label: "Malayalam (മലയാളം)" },
        ].map((option) => {
          const isSelected = language === option.id;
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
              <RadioGroupItem value={option.id} id={option.id} className="shrink-0 ml-2 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-cyan-500/50" />
            </div>
          );
        })}
      </RadioGroup>
      {errors.language && (
        <p role="alert" className="text-[11px] text-red-400 mt-2 font-semibold">
          {errors.language}
        </p>
      )}
    </div>
  );
}
