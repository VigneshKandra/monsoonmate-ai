"use client";

import { useState } from "react";
import { PreparednessPlanResponse } from "@/types/planner";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Clock,
  Users,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Sparkles,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Printer,
  Info
} from "lucide-react";
import { downloadPlanPDF } from "@/utils/pdfGenerator";
interface PreparednessDashboardProps {
  plan: PreparednessPlanResponse;
  onReset: () => void;
}

export function PreparednessDashboard({ plan, onReset }: PreparednessDashboardProps) {
  const [activeTab, setActiveTab] = useState<"before" | "during" | "after">("before");
  const [checkedPriority, setCheckedPriority] = useState<Record<string, boolean>>({});
  const [checkedKit, setCheckedKit] = useState<Record<string, boolean>>({});
  const [checkedChecklist, setCheckedChecklist] = useState<Record<string, boolean>>({});

  // Parse risk configuration colors
  const getRiskConfig = (level: string) => {
    const lvl = level.toLowerCase();
    if (lvl.includes("severe") || lvl.includes("red") || lvl.includes("extreme")) {
      return {
        bg: "bg-red-500/10 border-red-500/40",
        text: "text-red-400",
        border: "border-red-500",
        badge: "bg-red-950/80 border-red-800 text-red-400",
        glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
        icon: ShieldAlert,
      };
    }
    if (lvl.includes("high") || lvl.includes("orange")) {
      return {
        bg: "bg-orange-500/10 border-orange-500/40",
        text: "text-orange-400",
        border: "border-orange-500",
        badge: "bg-orange-950/80 border-orange-800 text-orange-400",
        glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]",
        icon: AlertTriangle,
      };
    }
    if (lvl.includes("moderate") || lvl.includes("yellow") || lvl.includes("medium")) {
      return {
        bg: "bg-yellow-500/10 border-yellow-500/40",
        text: "text-yellow-400",
        border: "border-yellow-500",
        badge: "bg-yellow-950/80 border-yellow-800 text-yellow-400",
        glow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]",
        icon: AlertCircle,
      };
    }
    // Low / Green default
    return {
      bg: "bg-emerald-500/10 border-emerald-500/40",
      text: "text-emerald-400",
      border: "border-emerald-500",
      badge: "bg-emerald-950/80 border-emerald-800 text-emerald-400",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
      icon: CheckCircle2,
    };
  };

  const risk = getRiskConfig(plan.riskLevel);
  const RiskIcon = risk.icon;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      <div className="mx-auto max-w-7xl flex flex-col gap-6">
        
        {/* Dashboard Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 hover:text-white h-9 rounded-lg"
              aria-label="Back to home screen"
            >
              <ArrowLeft className="size-4 mr-2" />
              Configure Profile
            </Button>
            <span className="h-6 w-px bg-slate-900 hidden sm:inline" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
              Preparedness Command
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadPlanPDF(plan)}
              className="border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 hover:text-white h-9 rounded-lg gap-1.5"
            >
              <Briefcase className="size-4" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 hover:text-white h-9 rounded-lg hidden sm:flex"
            >
              <Printer className="size-4 mr-2" />
              Print Dashboard
            </Button>
            <Button
              size="sm"
              onClick={onReset}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold h-9 rounded-lg gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              New Configuration
            </Button>
          </div>
        </div>

        {/* Grid Layout Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT 2 COLUMNS: Risk Indicators & Timelines */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Top Section: Risk & Priority Actions */}
            <div className={`rounded-2xl border ${risk.bg} ${risk.glow} p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start`}>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${risk.badge}`}>
                    {plan.riskLevel} Risk Level
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono font-bold tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="size-3.5 text-slate-500" />
                    MET_EVAL_STATUS
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
                  <RiskIcon className={`size-6 ${risk.text}`} />
                  Meteorological Threat Assessment
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                  {plan.riskSummary}
                </p>
              </div>
            </div>

            {/* Today's Priority Actions */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-slate-100 tracking-tight">Today&apos;s Priority Actions</h3>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed -mt-1 font-semibold">
                High-priority procedures recommended for completion before precipitation begins. Check items off as they are secured.
              </p>
              <div className="grid gap-3 mt-2">
                {plan.preparednessPlan.today.map((action, idx) => {
                  const isChecked = checkedPriority[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => setCheckedPriority(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? "bg-cyan-950/10 border-cyan-500/30"
                          : "bg-slate-950/50 border-slate-800/60 hover:bg-slate-900/40"
                      }`}
                    >
                      <div className={`size-4.5 rounded border flex items-center justify-center font-extrabold text-[10px] shrink-0 mt-0.5 transition-all ${
                        isChecked 
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-400" 
                          : "border-slate-700 bg-slate-950"
                      }`}>
                        {isChecked && "✓"}
                      </div>
                      <span className={`text-xs sm:text-sm font-semibold leading-normal ${isChecked ? "line-through text-slate-500" : "text-slate-200"}`}>
                        {action}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline: Before, During, After Rain */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 sm:p-8 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight">Readiness Timeline</h3>
                </div>
                
                {/* Custom Styled Switch Tabs */}
                <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-850 self-start sm:self-auto shrink-0 font-bold">
                  {[
                    { id: "before", label: "Before Rain" },
                    { id: "during", label: "During Rain" },
                    { id: "after", label: "After Rain" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as "before" | "during" | "after")}
                      className={`px-3 py-1.5 rounded-lg text-xs tracking-wide transition-all ${
                        activeTab === tab.id
                          ? "bg-slate-900 text-cyan-400 border border-slate-850 shadow-sm"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Timeline Card List Render */}
              <div className="space-y-4">
                {activeTab === "before" && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-lg text-xs text-blue-300 flex items-center gap-2.5">
                      <HelpCircle className="size-4 shrink-0" />
                      Procedures to be established today/tomorrow to reinforce structures.
                    </div>
                    {plan.preparednessPlan.tomorrow.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-4 rounded-xl border border-slate-800/80 bg-slate-950/50">
                        <span className="flex items-center justify-center size-5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400 shrink-0 font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">{item}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "during" && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="p-3 bg-amber-950/15 border border-amber-900/30 rounded-lg text-xs text-amber-300 flex items-center gap-2.5">
                      <HelpCircle className="size-4 shrink-0" />
                      In-storm safety protocols. Avoid travel unless strictly mandatory.
                    </div>
                    {plan.preparednessPlan.duringRain.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-4 rounded-xl border border-slate-800/80 bg-slate-950/50">
                        <span className="flex items-center justify-center size-5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-450 shrink-0 font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">{item}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "after" && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="p-3 bg-emerald-950/15 border border-emerald-900/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2.5">
                      <HelpCircle className="size-4 shrink-0" />
                      Recovery guidelines, drainage checks, and vector prevention strategies.
                    </div>
                    {plan.preparednessPlan.afterRain.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start p-4 rounded-xl border border-slate-800/80 bg-slate-950/50">
                        <span className="flex items-center justify-center size-5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-450 shrink-0 font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Travel Advisory Card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 sm:p-8 flex flex-col gap-5">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-4 justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="size-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight">Transit & Travel Advisory</h3>
                </div>
                <div className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  plan.travelAdvisory.status.toLowerCase().includes("danger") || plan.travelAdvisory.status.toLowerCase().includes("restrict")
                    ? "bg-red-950/80 border border-red-800 text-red-400"
                    : "bg-blue-950/80 border border-blue-800 text-blue-400"
                }`}>
                  Status: {plan.travelAdvisory.status}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950/45 p-4 rounded-xl border border-slate-850 text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                <Info className="size-4.5 text-cyan-400 shrink-0 mt-0.5" />
                {plan.travelAdvisory.recommendation}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Avoid sectors */}
                <div className="p-4 rounded-xl border border-red-900/10 bg-red-950/5 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono">Avoid Situations</h4>
                  <ul className="space-y-2.5">
                    {plan.travelAdvisory.avoid.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 font-semibold">
                        <span className="size-1.5 rounded-full bg-red-500 shrink-0 mt-1.5 animate-pulse" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Safe Options */}
                <div className="p-4 rounded-xl border border-emerald-900/10 bg-emerald-950/5 flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">Safe Protocols</h4>
                  <ul className="space-y-2.5">
                    {plan.travelAdvisory.safeOptions.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 font-semibold">
                        <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar Checklists, Kit, Contacts */}
          <div className="flex flex-col gap-6">

            {/* Emergency Kit List */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Briefcase className="size-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">Essential Kit Supplies</h3>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed -mt-2 font-semibold">
                Stock these critical provisions immediately in your waterproof grab-bag.
              </p>
              <div className="flex flex-col gap-2 mt-2">
                {plan.emergencyKit.map((item, idx) => {
                  const isChecked = checkedKit[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => setCheckedKit(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isChecked ? "bg-cyan-950/10 border-cyan-500/30" : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/40"
                      }`}
                    >
                      <span className={`text-xs font-semibold select-none leading-relaxed ${isChecked ? "line-through text-slate-500" : "text-slate-300"}`}>
                        {item}
                      </span>
                      <div className={`size-4 rounded border flex items-center justify-center font-extrabold text-[9px] shrink-0 ml-4 transition-all ${
                        isChecked 
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-400" 
                          : "border-slate-700 bg-slate-950"
                      }`}>
                        {isChecked && "✓"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Custom Checklist Additions */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Users className="size-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">Household Checklists</h3>
              </div>
              <p className="text-xs text-slate-450 leading-relaxed -mt-2 font-semibold">
                Dynamic safety checkpoints compiled based on your dependency parameters.
              </p>
              <div className="flex flex-col gap-2 mt-2">
                {plan.emergencyChecklist.map((item, idx) => {
                  const isChecked = checkedChecklist[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => setCheckedChecklist(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isChecked ? "bg-cyan-950/10 border-cyan-500/30" : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/40"
                      }`}
                    >
                      <span className={`text-xs font-semibold select-none leading-relaxed ${isChecked ? "line-through text-slate-500" : "text-slate-300"}`}>
                        {item}
                      </span>
                      <div className={`size-4 rounded border flex items-center justify-center font-extrabold text-[9px] shrink-0 ml-4 transition-all ${
                        isChecked 
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-400" 
                          : "border-slate-700 bg-slate-950"
                      }`}>
                        {isChecked && "✓"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Support Contacts */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Phone className="size-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">Civil Contacts</h3>
              </div>
              <div className="grid gap-2.5">
                {plan.emergencyContacts.map((contact, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/45 border border-slate-850 rounded-xl flex items-start gap-3">
                    <Phone className="size-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 leading-tight">{contact.name}</h4>
                      <p className="text-[10px] text-slate-450 leading-relaxed mt-1 font-semibold">{contact.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Recommendations */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
                <Users className="size-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">Community Recommendations</h3>
              </div>
              <ul className="space-y-2 mt-1">
                {plan.communityRecommendations.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-350 leading-relaxed flex items-start gap-2 font-semibold">
                    <span className="size-1 bg-cyan-400 rounded-full shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Final AI Message */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-[0_0_30px_rgba(6,182,212,0.03)]">
              <div className="flex gap-3">
                <Sparkles className="size-5 text-cyan-400 shrink-0 animate-pulse mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 font-mono tracking-wider uppercase">Civil Officer Advisory</h4>
                  <p className="text-xs text-slate-300/90 leading-relaxed mt-2.5 italic font-semibold">
                    &quot;{plan.finalMessage}&quot;
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
