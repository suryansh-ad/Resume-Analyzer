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
    <section className="mb-20 relative overflow-hidden rounded-[2.5rem] border border-cyan-500/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.1),transparent_35%),linear-gradient(to_bottom_right,rgba(15,23,42,0.6),rgba(2,6,23,0.8))] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid md:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={12} className="animate-spin" />
            New AI-Powered Matching
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Get Jobs & Internships Curated Specially For You.
          </h2>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Stop scanning hundreds of generic job posts. Fill out your skills and interests or upload a resume to instantly discover the best entry-level tech roles in India curated for your exact profile.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>Real-time match percentage checks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>Resume parsing to auto-detect skills</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>Tailored filters for Indian Graduates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
              <span>Skip and update anytime you want</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-950/60 border border-white/5 md:h-full">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4">
            Curate matches in seconds
          </p>
          
          <button
            onClick={handleCtaClick}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-xl transition hover:-translate-y-0.5 cursor-pointer shadow-lg shadow-cyan-500/10 w-full justify-center group"
          >
            <span>{user ? "View Career Matches" : "Sign In to Get Matches"}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </button>
          
          <p className="text-[10px] text-slate-500 mt-3">
            {user ? "Personalize your profile fields now" : "Requires email or Google sign in"}
          </p>
        </div>
      </div>
    </section>
  );
}
