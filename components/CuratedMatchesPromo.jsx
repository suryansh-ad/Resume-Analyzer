"use client";

import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "./LayoutWrapper";

import { useRouter } from "next/navigation";

export function CuratedMatchesPromo() {
  const { user, authReady } = useAuth();
  const router = useRouter();

  const handleCtaClick = () => {
    if (!authReady) return;
    if (user) {
      router.push("/matches");
    } else {
      const authSection = document.getElementById("auth");
      if (authSection) {
        authSection.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = "auth";
      }
    }
  };

  return (
    <section className="mb-20 relative overflow-hidden rounded-2xl border border-white/[0.05] bg-slate-900/10 p-10 md:p-14 shadow-sm pl-12 md:pl-20 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[5px] before:bg-gradient-to-b before:from-cyan-400 before:to-indigo-500">
      {/* Subtle backdrop glow */}
      <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-500/[0.02] blur-3xl pointer-events-none" />

      <div className="relative z-10 grid md:grid-cols-[1.35fr_0.65fr] gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 bg-slate-950/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Sparkles size={11} className="text-cyan-400" />
            AI-Powered Matching
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug font-heading">
            Jobs & Internships curated for your profile.
          </h2>
          
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl font-medium">
            Skip scanning endless generic listings. Upload your resume or specify your skills to instantly see relevant entry-level positions in tech matching your capabilities.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-cyan-500 shrink-0" />
              <span>Real-time match scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-cyan-500 shrink-0" />
              <span>Auto-extracted skills from resume</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-cyan-500 shrink-0" />
              <span>Tailored filters for Indian grads</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-cyan-500 shrink-0" />
              <span>Update details anytime</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-slate-950/40 border border-white/[0.04] md:h-full">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">
            Curated in seconds
          </p>
          
          <button
            onClick={handleCtaClick}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl transition duration-200 w-full justify-center group cursor-pointer shadow-lg shadow-cyan-500/10 hover:-translate-y-0.5"
          >
            <span>{user ? "View Career Matches" : "Sign In to Get Matches"}</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition shrink-0" />
          </button>
          
          <p className="text-[11px] text-slate-500 mt-3.5 font-semibold">
            {user ? "Personalize profile fields now" : "Requires email or Google login"}
          </p>
        </div>
      </div>
    </section>
  );
}
