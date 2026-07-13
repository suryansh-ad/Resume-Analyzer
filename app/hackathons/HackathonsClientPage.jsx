"use client";

import { useEffect, useState } from "react";
import { Award, Calendar, Search, MapPin, AlertCircle, RefreshCw } from "lucide-react";

export default function HackathonsClientPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState(""); // Online, Offline, Hybrid

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        mode: modeFilter,
      });

      const response = await fetch(`/api/hackathons?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch hackathons");
      }
      const data = await response.json();
      setHackathons(data || []);
    } catch (error) {
      console.error("[Fetch Hackathons] Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, [modeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHackathons();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/[0.02] blur-3xl pointer-events-none" />

      {/* Page Header */}
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5 font-heading">
          <Award className="text-cyan-400 shrink-0" size={30} />
          Student <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">Hackathons</span> & Contests
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 font-medium">
          Participate in premier engineering hackathons, design sprints, and coding competitions in India to build your portfolio and win prizes.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-slate-900/10 border border-white/[0.05] p-4 rounded-2xl relative z-10">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-slate-950/40 border border-white/10 rounded-xl p-1.5 focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/25 transition w-full md:max-w-md">
          <div className="flex items-center flex-grow pl-3">
            <Search className="text-slate-500 mr-2 shrink-0" size={15} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons by name, host, or topics..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none py-1.5 font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-cyan-500/10 hover:-translate-y-0.5"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 tracking-wider">Mode:</span>
          <div className="flex gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-white/5 w-full md:w-auto justify-between">
            {["", "Online", "Offline", "Hybrid"].map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`text-[10px] sm:text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  modeFilter === mode
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {mode || "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 w-full rounded-2xl border border-white/5 bg-slate-900/10 animate-pulse" />
          ))}
        </div>
      ) : hackathons.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-12 text-center text-slate-400">
          <AlertCircle className="mx-auto text-slate-500 mb-3" size={32} />
          <p className="text-sm font-bold text-white mb-1 font-heading">No hackathons found</p>
          <p className="text-xs text-slate-500 font-medium">Try checking back later or tweaking your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 relative z-10">
          {hackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className="relative flex flex-col p-6 rounded-2xl border border-white/[0.05] bg-slate-900/15 backdrop-blur-sm hover:border-cyan-500/25 hover:bg-slate-900/35 transition-all duration-200 hover:-translate-y-0.5 overflow-hidden group shadow-sm hover:shadow-cyan-500/[0.02] pl-8 before:absolute before:left-0 before:top-5 before:bottom-5 before:w-[3.5px] before:rounded-r before:bg-violet-500/30 group-hover:before:bg-violet-400 group-hover:before:shadow-[0_0_8px_rgba(139,92,246,0.5)] before:transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[8px] uppercase font-bold text-cyan-400 px-2 py-0.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                  {hackathon.mode}
                </span>
                <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                  <Calendar size={10} className="text-slate-600" />
                  {new Date(hackathon.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug font-heading group-hover:text-cyan-400 transition duration-200">
                {hackathon.name}
              </h3>
              <p className="text-[10px] text-slate-400 mb-4 line-clamp-3 leading-relaxed font-medium">
                Organized by <strong className="text-slate-300">{hackathon.organizer}</strong>. {hackathon.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 p-3 rounded-xl bg-slate-950 border border-white/[0.04]">
                <div>
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wide block">Difficulty</span>
                  <span className="text-xs font-bold text-slate-300 mt-0.5">{hackathon.difficulty}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-wide block">Team Size</span>
                  <span className="text-xs font-bold text-slate-300 mt-0.5">{hackathon.teamSize}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-slate-500 block uppercase font-extrabold tracking-wide">Prize Pool</span>
                  <span className="text-sm font-bold text-emerald-450">{hackathon.prizePool || "Goodies"}</span>
                </div>
                <a
                  href={hackathon.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 hover:bg-cyan-500 hover:border-cyan-500 hover:text-slate-950 transition duration-205 cursor-pointer shadow-sm"
                >
                  Register
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
