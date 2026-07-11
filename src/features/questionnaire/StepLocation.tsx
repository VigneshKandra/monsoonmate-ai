import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { LocationData } from "./types";

interface StepLocationProps {
  location: LocationData;
  onChange: (field: keyof LocationData, value: string) => void;
  errors: Record<string, string>;
  isLocating: boolean;
  onDetectLocation: () => void;
}

export function StepLocation({
  location,
  onChange,
  errors,
  isLocating,
  onDetectLocation,
}: StepLocationProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2.5 mb-1.5">
        <MapPin className="size-5 text-cyan-400 shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">Where are you located?</h3>
      </div>
      
      <div className="grid gap-4">
        <div>
          <Label htmlFor="country" className="text-xs font-bold text-slate-450">Country</Label>
          <Input
            id="country"
            placeholder="e.g. India"
            value={location.country}
            onChange={(e) => onChange("country", e.target.value)}
            aria-invalid={errors.country ? "true" : "false"}
            aria-describedby={errors.country ? "country-error" : undefined}
            className={`mt-1.5 bg-slate-950 text-slate-200 focus-visible:ring-cyan-500/50 h-10 ${
              errors.country ? "border-red-500 focus-visible:ring-red-500/30" : "border-slate-800"
            }`}
          />
          {errors.country && (
            <p id="country-error" role="alert" className="text-[11px] text-red-400 mt-1 font-semibold">
              {errors.country}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state" className="text-xs font-bold text-slate-450">State</Label>
            <Input
              id="state"
              placeholder="e.g. Maharashtra"
              value={location.state}
              onChange={(e) => onChange("state", e.target.value)}
              aria-invalid={errors.state ? "true" : "false"}
              aria-describedby={errors.state ? "state-error" : undefined}
              className={`mt-1.5 bg-slate-950 text-slate-200 focus-visible:ring-cyan-500/50 h-10 ${
                errors.state ? "border-red-500 focus-visible:ring-red-500/30" : "border-slate-800"
              }`}
            />
            {errors.state && (
              <p id="state-error" role="alert" className="text-[11px] text-red-400 mt-1 font-semibold">
                {errors.state}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="city" className="text-xs font-bold text-slate-450">City</Label>
            <Input
              id="city"
              placeholder="e.g. Mumbai"
              value={location.city}
              onChange={(e) => onChange("city", e.target.value)}
              aria-invalid={errors.city ? "true" : "false"}
              aria-describedby={errors.city ? "city-error" : undefined}
              className={`mt-1.5 bg-slate-950 text-slate-200 focus-visible:ring-cyan-500/50 h-10 ${
                errors.city ? "border-red-500 focus-visible:ring-red-500/30" : "border-slate-800"
              }`}
            />
            {errors.city && (
              <p id="city-error" role="alert" className="text-[11px] text-red-400 mt-1 font-semibold">
                {errors.city}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="pincode" className="text-xs font-bold text-slate-450">Pin Code (Optional)</Label>
          <Input
            id="pincode"
            placeholder="e.g. 400001"
            value={location.pinCode}
            onChange={(e) => onChange("pinCode", e.target.value)}
            className="mt-1.5 bg-slate-950 border-slate-800 focus-visible:ring-cyan-500/50 text-slate-200 h-10"
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onDetectLocation}
        disabled={isLocating}
        className="w-full mt-2 border-slate-800 hover:border-slate-700 bg-slate-950/40 text-xs text-cyan-400 hover:text-cyan-300 font-bold h-10 hover:scale-[1.01] active:scale-[0.99] transition-all"
      >
        {isLocating ? (
          <>
            <span className="size-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2" />
            Acquiring GPS coordinates...
          </>
        ) : (
          <>
            <MapPin className="size-3.5 mr-2" />
            Detect Location (Simulated GPS)
          </>
        )}
      </Button>
    </div>
  );
}
