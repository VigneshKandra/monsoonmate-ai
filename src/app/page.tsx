"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CloudLightning,
  ShieldAlert,
  FileText,
  ListTodo,
  Navigation,
  Globe,
  Users,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Activity,
  Menu,
  X,
  Compass,
  CheckCircle2
} from "lucide-react";
import { QuestionnaireModal } from "@/features/questionnaire/QuestionnaireModal";
import { PreparednessDashboard } from "@/features/dashboard/PreparednessDashboard";
import { PreparednessPlanResponse } from "@/types/planner";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [plan, setPlan] = useState<PreparednessPlanResponse | null>(null);

  if (plan) {
    return (
      <PreparednessDashboard plan={plan} onReset={() => setPlan(null)} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden antialiased">
      {/* Background Decorative Glows */}
      <div 
        className="absolute top-0 left-1/4 w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse-slow" 
        aria-hidden="true"
      />
      <div 
        className="absolute top-[20%] right-10 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-float-slow" 
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-[30%] left-10 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none -z-10" 
        aria-hidden="true"
      />

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/40 bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo (Text Only) */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
              MonsoonMate AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
            <a
              href="#about"
              className="transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 rounded px-2 py-1"
              aria-label="About MonsoonMate AI"
            >
              About
            </a>
            <a
              href="#features"
              className="transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 rounded px-2 py-1"
              aria-label="Core Safety Features"
            >
              Features
            </a>
            <a
              href="#why-us"
              className="transition-colors hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 rounded px-2 py-1"
              aria-label="Why choose MonsoonMate AI"
            >
              Why MonsoonMate
            </a>
          </nav>

          {/* Get Started Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-cyan-950/50 hover:shadow-cyan-900/60 transition-all duration-300 border-none px-5 h-9 rounded-lg hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              onClick={() => setIsQuestionnaireOpen(true)}
              aria-label="Get Started with MonsoonMate AI"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 md:hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-900 bg-slate-950/95 backdrop-blur-lg px-6 py-8 flex flex-col gap-5 animate-in fade-in slide-in-from-top-5 duration-200">
            <a
              href="#about"
              className="text-base font-semibold text-slate-300 hover:text-slate-100 transition-colors py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#features"
              className="text-base font-semibold text-slate-300 hover:text-slate-100 transition-colors py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#why-us"
              className="text-base font-semibold text-slate-300 hover:text-slate-100 transition-colors py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why MonsoonMate
            </a>
            <hr className="border-slate-900 my-2" />
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold h-11"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsQuestionnaireOpen(true);
              }}
            >
              Get Started
            </Button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section
          id="hero"
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-20 sm:pb-28 lg:pb-36 flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
        >
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Government Grade Readiness Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/80 text-blue-300 text-[11px] font-bold uppercase tracking-widest mb-8 animate-pulse-ring">
              <Shield className="size-3.5 text-cyan-400" />
              Active Monsoon Readiness Protocol
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-50 via-slate-100 to-cyan-200 leading-[1.08] max-w-2xl">
              Prepare Today.<br className="hidden sm:inline" />Stay Safe Tomorrow.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-300/95 max-w-xl leading-relaxed font-normal">
              AI-powered personalized monsoon preparedness for individuals, families and communities.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:to-blue-600 text-white font-bold shadow-lg shadow-cyan-950/30 transition-all duration-300 group hover:-translate-y-0.5 rounded-xl px-8 h-12 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                onClick={() => setIsQuestionnaireOpen(true)}
                aria-label="Initiate your preparedness program"
              >
                Get Prepared
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:bg-slate-900 transition-all duration-300 rounded-xl px-8 h-12 hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                onClick={() => {
                  const element = document.getElementById("about");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                aria-label="Learn more about safety protocols"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Illustration (Dashboard Interface Mockup with Lucide Icons Only) */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none animate-float">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider font-semibold">
                  READINESS_CONSOLE.SH
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE_WEATHER_FEED
                </div>
              </div>

              {/* Simulated Live Alert Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-amber-900/40 bg-amber-950/15">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <ShieldAlert className="size-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    Active Heavy Rainfall Alert
                  </h4>
                  <p className="text-xs text-amber-400/80 mt-1 leading-relaxed">
                    Precipitation levels forecast above 120mm in next 24 hours. High risk of local waterlogging.
                  </p>
                </div>
              </div>

              {/* Quick Metrics Dashboard Layout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/50 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                    Readiness Score
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-slate-100 font-mono">
                    84%
                  </div>
                  <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[84%] rounded-full" />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/50 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                    Travel Status
                    <Compass className="size-4 text-cyan-400" />
                  </div>
                  <div className="text-sm font-bold text-cyan-400 flex items-center gap-1 mt-1">
                    <Activity className="size-4 animate-pulse" />
                    Routes Modified
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Avoiding Zone-B underpasses due to overflow risk.
                  </p>
                </div>
              </div>

              {/* Checklist Preview */}
              <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/50 flex flex-col gap-3">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Critical Checklist
                </h5>
                <div className="flex flex-col gap-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="size-4.5 rounded border border-emerald-500 bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-[10px] shrink-0">
                      ✓
                    </div>
                    Stock emergency dry-rations (3 days supply)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-4.5 rounded border border-emerald-500 bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-[10px] shrink-0">
                      ✓
                    </div>
                    Backup legal documents in waterproof sleeve
                  </div>
                  <div className="flex items-center gap-2 text-slate-450">
                    <div className="size-4.5 rounded border border-slate-700 bg-slate-950 shrink-0" />
                    Verify generator status & charge power banks
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 border-t border-slate-900 relative"
        >
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="size-3 text-cyan-400 animate-pulse" />
              Civil Mitigation Systems
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100">
              Intelligent Protection Framework
            </h2>
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              MonsoonMate AI synthesizes real-time local weather observations with state-of-the-art predictive generative AI models. By mapping dynamic rain indexes, flash flood potentials, and transit conditions, we generate structured, high-reliability safety instructions for households and districts.
            </p>

            <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-slate-800/60 bg-slate-900/25 max-w-2xl w-full text-left">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                  Verified Integrity Status
                </span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-6 text-center border-t border-slate-850 pt-6">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono">100%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Static Mode API</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono">&lt; 100ms</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Latency Rate</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono">Tier-1</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Disaster Protocol</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 border-t border-slate-900"
        >
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
              Features Guide
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100">
              Engineered to Mitigate Monsoon Hazards
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-400">
              A comprehensive suite of static, responsive emergency utilities designed for extreme weather.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="group relative p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-5px_rgba(6,182,212,0.08)]">
              <div className="p-3 w-fit rounded-xl bg-blue-950/50 border border-blue-800/40 text-blue-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all">
                <FileText className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-6 group-hover:text-cyan-300 transition-colors">
                Personalized AI Plans
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Step-by-step custom preparedness guides compiled based on your family demographics, medical alerts, and local region.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-5px_rgba(6,182,212,0.08)]">
              <div className="p-3 w-fit rounded-xl bg-cyan-950/50 border border-cyan-800/40 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/20 transition-all">
                <ListTodo className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-6 group-hover:text-cyan-300 transition-colors">
                Emergency Checklist
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Interactive survival kits with categories for medical supplies, hydration, light gear, and custom user add-ons.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-5px_rgba(6,182,212,0.08)]">
              <div className="p-3 w-fit rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 group-hover:text-emerald-300 group-hover:border-cyan-500/20 transition-all">
                <Navigation className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-6 group-hover:text-emerald-300 transition-colors">
                Travel Advisory
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Commute risk evaluations analyzing waterlogging statistics, visibility indexes, and transit hazards across coordinates.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group relative p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-5px_rgba(6,182,212,0.08)]">
              <div className="p-3 w-fit rounded-xl bg-slate-950 border border-slate-800/80 text-slate-350 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all">
                <CloudLightning className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-6 group-hover:text-cyan-300 transition-colors">
                Weather-aware Guidance
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Translates raw precipitation and wind forecasts directly into household precautions and home reinforcement advice.
              </p>
            </div>

            {/* Card 5 */}
            <div className="group relative p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-5px_rgba(6,182,212,0.08)]">
              <div className="p-3 w-fit rounded-xl bg-slate-950 border border-slate-800/80 text-slate-350 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all">
                <Globe className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-6 group-hover:text-cyan-300 transition-colors">
                Multilingual Support
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Accessible information pathways configured in multiple local languages to ensure critical updates read clearly to all.
              </p>
            </div>

            {/* Card 6 */}
            <div className="group relative p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/50 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-5px_rgba(6,182,212,0.08)]">
              <div className="p-3 w-fit rounded-xl bg-slate-950 border border-slate-800/80 text-slate-350 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all">
                <Users className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-6 group-hover:text-cyan-300 transition-colors">
                Community Safety
              </h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Coordination guidance for apartment boards, drainage maintenance, local shelter mappings, and sharing dry resources.
              </p>
            </div>
          </div>
        </section>

        {/* Why MonsoonMate Section */}
        <section
          id="why-us"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 border-t border-slate-900"
        >
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
            <span className="px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
              Mitigation Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100">
              Why MonsoonMate AI?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-400">
              Our three functional guidelines mapping out structural safety.
            </p>
          </div>

          <div className="mt-16 flex flex-col gap-6">
            {/* Card: Fast */}
            <div className="group flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/40 hover:border-cyan-500/20 transition-all duration-300">
              <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
                <Clock className="size-7 sm:size-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  Fast
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
                  Generate localized mitigation reports, customized food and battery checklist recommendations, and route warnings in seconds. Instantly adapt schedules when sudden warnings are issued.
                </p>
              </div>
            </div>

            {/* Card: Personalized */}
            <div className="group flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/40 hover:border-cyan-500/20 transition-all duration-300">
              <div className="p-4 rounded-xl bg-blue-950/50 border border-blue-800/30 text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                <Users className="size-7 sm:size-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  Personalized
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
                  No two storm events or families are alike. Our system adjusts instructions to account for dependents, mobility requirements, elevation variables, and local historical drainage factors.
                </p>
              </div>
            </div>

            {/* Card: Reliable */}
            <div className="group flex flex-col sm:flex-row items-start gap-6 p-6 sm:p-8 rounded-2xl border border-slate-900 bg-slate-900/20 hover:bg-slate-900/40 hover:border-cyan-500/20 transition-all duration-300">
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/30 text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                <Shield className="size-7 sm:size-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  Reliable
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
                  We formulate emergency guidance and plans directly from established local civil defense guidelines, evacuation blueprints, and meteorological severe precipitation indices.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-bold text-slate-400">MonsoonMate AI</span>
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} MonsoonMate AI. Official Hackathon Project. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6 font-semibold text-slate-450 text-xs">
            <span>Built with Google Gemini</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" aria-hidden="true" />
            <span>Made for PromptWars</span>
          </div>
        </div>
      </footer>

      {isQuestionnaireOpen && (
        <QuestionnaireModal 
          isOpen={isQuestionnaireOpen} 
          onClose={() => setIsQuestionnaireOpen(false)} 
          onPlanGenerated={(generatedPlan) => setPlan(generatedPlan)}
        />
      )}
    </div>
  );
}
