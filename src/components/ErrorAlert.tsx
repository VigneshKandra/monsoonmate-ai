import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, XCircle } from "lucide-react";

interface ErrorAlertProps {
  title: string;
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
  isRetrying?: boolean;
}

export function ErrorAlert({
  title,
  message,
  onRetry,
  onDismiss,
  isRetrying = false,
}: ErrorAlertProps) {
  return (
    <div 
      className="p-5 rounded-xl border border-red-900/40 bg-red-950/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="size-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-red-300 tracking-tight leading-none">
            {title}
          </h4>
          <p className="text-xs text-red-400/90 mt-2 leading-relaxed font-semibold">
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          disabled={isRetrying}
          className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          aria-label="Dismiss alert"
        >
          <XCircle className="size-4.5" />
        </button>
      </div>

      <div className="flex items-center gap-3 mt-1 justify-end border-t border-red-900/20 pt-3">
        <Button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 hover:border-red-500/60 text-red-200 text-xs font-bold py-1.5 h-8.5 rounded-lg px-4 hover:scale-[1.01] active:scale-[0.99] transition-all gap-1.5"
        >
          {isRetrying ? (
            <>
              <span className="size-3 border-2 border-red-200 border-t-transparent rounded-full animate-spin mr-1" />
              Retrying...
            </>
          ) : (
            <>
              <RotateCcw className="size-3.5" />
              Retry Plan Generation
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
