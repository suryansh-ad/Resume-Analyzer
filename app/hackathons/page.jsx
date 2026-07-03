"use client";

import { useEffect, useState } from "react";
import { Award, Calendar, Search, MapPin, AlertCircle, RefreshCw } from "lucide-react";

export default function HackathonsPage() {
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
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <Award className="text-cyan-400" size={32} />
          Student Hackathons & Coding Contests
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Participate in premier engineering hackathons, design sprints, and coding competitions in India to build your portfolio and win prizes.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-slate-900/10 border border-white/5 p-4 rounded-2xl">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-slate-950/40 border border-white/10 rounded-xl p-1.5 focus-within:border-cyan-500/30 transition w-full md:max-w-md">
          <div className="flex items-center flex-grow pl-3">
            <Search className="text-slate-400 mr-2 shrink-0" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons by name, host, or topics..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none py-1.5"
            />
          </div>
          <button
            type="submit"
            className="bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-lg transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-500 shrink-0">Mode:</span>
          <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5 w-full md:w-auto justify-between">
            {["", "Online", "Offline", "Hybrid"].map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={`text-[10px] sm:text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  modeFilter === mode
                    ? "bg-white text-slate-950"
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
          <p className="text-sm font-bold text-white mb-1">No hackathons found</p>
          <p className="text-xs text-slate-500">Try checking back later or tweaking your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className="flex flex-col p-6 rounded-2xl border border-white/5 bg-slate-900/10 hover:border-cyan-500/20 hover:bg-slate-900/20 transition relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {hackathon.mode}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(hackathon.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug group-hover:text-cyan-400 transition">
                {hackathon.name}
              </h3>
              <p className="text-xs text-slate-400 mb-4 line-clamp-3">
                Organized by <strong className="text-slate-300">{hackathon.organizer}</strong>. {hackathon.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6 p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-medium block">Difficulty</span>
                  <span className="text-xs font-bold text-slate-300 mt-0.5">{hackathon.difficulty}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-medium block">Team Size</span>
                  <span className="text-xs font-bold text-slate-300 mt-0.5">{hackathon.teamSize}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Prize Pool</span>
                  <span className="text-sm font-bold text-emerald-400">{hackathon.prizePool || "Goodies"}</span>
                </div>
                <a
                  href={hackathon.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-200 transition"
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
