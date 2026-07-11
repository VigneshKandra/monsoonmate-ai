import { Info, ShieldCheck } from "lucide-react";
import { QuestionnaireResponses } from "./types";

interface StepSummaryProps {
  responses: QuestionnaireResponses;
}

export function StepSummary({ responses }: StepSummaryProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2.5 mb-1.5">
        <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">Summary Profile</h3>
      </div>

      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-xs sm:text-sm space-y-3.5 font-medium">
        {/* Location Summary */}
        <div className="flex justify-between items-start border-b border-slate-900 pb-2.5">
          <span className="text-slate-450 uppercase tracking-wider text-[10px] sm:text-xs">Location</span>
          <span className="text-slate-200 text-right leading-normal font-semibold">
            {responses.location.city}, {responses.location.state}, {responses.location.country}
            {responses.location.pinCode && ` (${responses.location.pinCode})`}
          </span>
        </div>

        {/* Target Summary */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
          <span className="text-slate-450 uppercase tracking-wider text-[10px] sm:text-xs">Plan For</span>
          <span className="text-slate-200 capitalize font-semibold">{responses.prepTarget}</span>
        </div>

        {/* Household Summary */}
        <div className="flex justify-between items-start border-b border-slate-900 pb-2.5">
          <span className="text-slate-450 uppercase tracking-wider text-[10px] sm:text-xs">Household Details</span>
          <span className="text-slate-200 text-right capitalize max-w-[200px] leading-relaxed font-semibold">
            {responses.householdInfo.includes("none")
              ? "No specific dependencies"
              : responses.householdInfo.map((item) => {
                  if (item === "children") return "Children";
                  if (item === "senior") return "Seniors";
                  if (item === "pregnant") return "Pregnant Members";
                  if (item === "disabilities") return "Mobility Support Needs";
                  if (item === "pets") return "Pets";
                  return item;
                }).join(", ")}
          </span>
        </div>

        {/* House Type Summary */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
          <span className="text-slate-450 uppercase tracking-wider text-[10px] sm:text-xs">House Type</span>
          <span className="text-slate-200 capitalize font-semibold">
            {responses.houseType === "apartment" && "Apartment"}
            {responses.houseType === "independent" && "Independent Villa"}
            {responses.houseType === "village" && "Village Dwelling"}
            {responses.houseType === "flood" && "Flood-prone Zone"}
            {responses.houseType === "other" && "Other type"}
          </span>
        </div>

        {/* Transport Summary */}
        <div className="flex justify-between items-center border-b border-slate-900 pb-2.5">
          <span className="text-slate-450 uppercase tracking-wider text-[10px] sm:text-xs">Transportation</span>
          <span className="text-slate-200 capitalize font-semibold">
            {responses.transportation === "car" && "Own Car"}
            {responses.transportation === "bike" && "Two-Wheeler"}
            {responses.transportation === "public" && "Public Commute"}
            {responses.transportation === "none" && "No vehicle"}
          </span>
        </div>

        {/* Language Summary */}
        <div className="flex justify-between items-center">
          <span className="text-slate-450 uppercase tracking-wider text-[10px] sm:text-xs">Language</span>
          <span className="text-slate-200 font-semibold">{responses.language}</span>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3.5 rounded-lg bg-emerald-950/15 border border-emerald-900/30 text-[11px] sm:text-xs text-emerald-400 mt-2 font-medium leading-relaxed">
        <Info className="size-4 shrink-0 mt-0.5" />
        Your safety configuration is stored locally. Clicking generate will compile your profile parameters and call Google Gemini.
      </div>
    </div>
  );
}
