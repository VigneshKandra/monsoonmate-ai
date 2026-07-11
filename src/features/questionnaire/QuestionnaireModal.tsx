"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

import { generatePreparednessPlan } from "@/services/gemini";
import { LocationData, QuestionnaireResponses } from "./types";
import { initialResponses, loadingMessages } from "./constants";
import { validateStep } from "./validation";
import { PreparednessPlanResponse } from "@/types/planner";

import { ProgressBar } from "./ProgressBar";
import { StepLocation } from "./StepLocation";
import { StepAudience } from "./StepAudience";
import { StepHousehold } from "./StepHousehold";
import { StepHousing } from "./StepHousing";
import { StepTransport } from "./StepTransport";
import { StepLanguage } from "./StepLanguage";
import { StepSummary } from "./StepSummary";
import { ErrorAlert } from "@/components/ErrorAlert";

const getErrorDetails = (errMessage: string) => {
  if (errMessage.startsWith("Configuration Error")) {
    return { 
      title: "API Key Configuration Missing", 
      message: "The application is missing a valid Gemini API Key. Please notify your administrator to configure NEXT_PUBLIC_GEMINI_API_KEY in the environment variable files." 
    };
  }
  if (errMessage.startsWith("Connection Error") || errMessage.startsWith("Network Error")) {
    return { 
      title: "Network Connection Disturbance", 
      message: errMessage 
    };
  }
  if (errMessage.startsWith("Timeout Error")) {
    return { 
      title: "Request Timeout Limit Exceeded", 
      message: "Google Gemini took too long to compile your preparedness plan. Please check your bandwidth speed and click retry." 
    };
  }
  if (errMessage.startsWith("Parsing Error") || errMessage.startsWith("Empty Response")) {
    return { 
      title: "Invalid Server Response Structure", 
      message: "MonsoonMate was unable to parse the safety plan response structure. Please click retry to compile the plan again." 
    };
  }
  return { 
    title: "Unexpected Server System Error", 
    message: errMessage 
  };
};

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: PreparednessPlanResponse) => void;
}

export function QuestionnaireModal({ isOpen, onClose, onPlanGenerated }: QuestionnaireModalProps) {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState<QuestionnaireResponses>(initialResponses);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLocating, setIsLocating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setActiveMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  const handleLocationChange = (field: keyof LocationData, value: string) => {
    setResponses((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleRadioChange = (field: keyof Omit<QuestionnaireResponses, "location" | "householdInfo">, value: string) => {
    setResponses((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setResponses((prev) => {
      let updatedInfo = [...prev.householdInfo];
      if (value === "none") {
        updatedInfo = checked ? ["none"] : [];
      } else {
        updatedInfo = updatedInfo.filter((item) => item !== "none");
        if (checked) {
          updatedInfo.push(value);
        } else {
          updatedInfo = updatedInfo.filter((item) => item !== value);
        }
      }
      return { ...prev, householdInfo: updatedInfo };
    });

    setErrors((prev) => {
      const next = { ...prev };
      delete next.householdInfo;
      return next;
    });
  };

  const detectLocationPlaceholder = () => {
    setIsLocating(true);
    setTimeout(() => {
      setResponses((prev) => ({
        ...prev,
        location: {
          country: "India",
          state: "Maharashtra",
          city: "Mumbai",
          pinCode: "400001",
        },
      }));
      setErrors({});
      setIsLocating(false);
    }, 1200);
  };

  const runStepValidation = (): boolean => {
    const stepErrors = validateStep(step, responses);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (runStepValidation()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.api;
      return next;
    });

    try {
      const plan = await generatePreparednessPlan(responses);
      console.log("MonsoonMate AI Generated Plan:", plan);
      onPlanGenerated(plan);
      onClose();
    } catch (err: unknown) {
      console.error("Plan generation error:", err);
      const message = err instanceof Error ? err.message : String(err);
      setErrors((prev) => ({ ...prev, api: message }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (isGenerating) return;
      if (!open) onClose();
    }}>
      <DialogContent className="relative max-w-md w-[92vw] max-h-[90vh] md:max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-800 text-slate-100 p-6 sm:p-8 rounded-2xl shadow-2xl focus-visible:outline-none focus:outline-none scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Full screen loading overlay inside modal */}
        {isGenerating && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-50 text-center animate-in fade-in duration-200">
            <div className="relative mb-6">
              <div className="absolute inset-0 w-16 h-16 bg-cyan-500/20 blur-xl rounded-full animate-pulse-slow" aria-hidden="true" />
              <div className="w-16 h-16 border-4 border-slate-800 border-t-cyan-500 rounded-full animate-spin" role="status" aria-label="Loading indicator" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-cyan-400 font-mono tracking-wider animate-pulse uppercase" aria-live="assertive">
              {loadingMessages[activeMessageIndex]}
            </h4>
            <p className="text-xs text-slate-400 mt-2.5 max-w-[260px] leading-relaxed font-semibold">
              MonsoonMate AI is analyzing parameters and compiling civil readiness checklists.
            </p>
          </div>
        )}

        <ProgressBar step={step} />

        <div className="sr-only">
          <DialogTitle>Monsoon Preparedness Step {step}</DialogTitle>
          <DialogDescription>Input your preparation criteria to generate custom checklists.</DialogDescription>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 7) {
              handleGeneratePlan();
            } else {
              handleNext();
            }
          }}
          className="mt-6 flex flex-col justify-between min-h-[320px] focus:outline-none"
        >
          <div className="flex-1">
            {step === 1 && (
              <StepLocation
                location={responses.location}
                onChange={handleLocationChange}
                errors={errors}
                isLocating={isLocating}
                onDetectLocation={detectLocationPlaceholder}
              />
            )}

            {step === 2 && (
              <StepAudience
                prepTarget={responses.prepTarget}
                onChange={(val) => handleRadioChange("prepTarget", val)}
                errors={errors}
              />
            )}

            {step === 3 && (
              <StepHousehold
                householdInfo={responses.householdInfo}
                onChange={handleCheckboxChange}
                errors={errors}
              />
            )}

            {step === 4 && (
              <StepHousing
                houseType={responses.houseType}
                onChange={(val) => handleRadioChange("houseType", val)}
                errors={errors}
              />
            )}

            {step === 5 && (
              <StepTransport
                transportation={responses.transportation}
                onChange={(val) => handleRadioChange("transportation", val)}
                errors={errors}
              />
            )}

            {step === 6 && (
              <StepLanguage
                language={responses.language}
                onChange={(val) => handleRadioChange("language", val)}
                errors={errors}
              />
            )}

            {step === 7 && (
              <StepSummary responses={responses} />
            )}
          </div>

          <div className="flex flex-col gap-3 mt-4 shrink-0">
            {errors.api && (() => {
              const { title, message } = getErrorDetails(errors.api);
              return (
                <ErrorAlert
                  title={title}
                  message={message}
                  onRetry={handleGeneratePlan}
                  onDismiss={() => {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.api;
                      return next;
                    });
                  }}
                  isRetrying={isGenerating}
                />
              );
            })()}
            <div className="flex items-center gap-3 border-t border-slate-800/80 pt-5">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isGenerating}
                  className="flex-1 border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 hover:text-white h-11 hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl font-bold disabled:opacity-50"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
              )}

              {step < 7 ? (
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold h-11 hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl"
                >
                  Next
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-11 hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isGenerating ? (
                    <>
                      <span className="size-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Compiling AI Plan...
                    </>
                  ) : (
                    <>
                      Generate My Plan
                      <Check className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
