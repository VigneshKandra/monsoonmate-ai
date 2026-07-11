interface ProgressBarProps {
  step: number;
}

export function ProgressBar({ step }: ProgressBarProps) {
  const progressPercentage = (step / 7) * 100;

  return (
    <div className="flex flex-col gap-3 shrink-0">
      <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-450 font-bold tracking-widest uppercase font-mono">
        <span>Readiness Profile Setup</span>
        <span aria-live="polite" className="text-cyan-400">Step {step} of 7</span>
      </div>
      <div 
        className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-950" 
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Profile setup progress"
      >
        <div
          className="bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
