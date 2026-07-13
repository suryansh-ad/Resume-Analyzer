"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Briefcase, Calendar, ChevronLeft, ChevronRight, AlertCircle, Filter, Building2 } from "lucide-react";

function InternshipsPageContent() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const [opportunityType, setOpportunityType] = useState("internship");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const [isRemote, setIsRemote] = useState(searchParams.get("remote") === "true");
  const [onlyWithSalary, setOnlyWithSalary] = useState(true);
  
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchOpportunities = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: "internship",
        search: searchQuery,
        location: locationFilter,
        remote: isRemote ? "true" : "false",
        hasSalaryOnly: onlyWithSalary ? "true" : "false",
        page: pageNumber.toString(),
        limit: "10"
      });

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch internships");
      }
      const data = await response.json();
      setOpportunities(data.data || []);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages || 1
      });
    } catch (error) {
      console.error("[Fetch Internships] Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities(1);
  }, [locationFilter, isRemote, onlyWithSalary]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setIsRemote(false);
    setOnlyWithSalary(false);
  };

  const activeFiltersCount = 
    (locationFilter ? 1 : 0) +
    (isRemote ? 1 : 0) +
    (onlyWithSalary ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/[0.02] blur-3xl pointer-events-none" />

      {/* Page Title */}
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-heading">
          Discover <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">Internships</span> in India
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 font-medium">
          Find paid and remote/on-site internships in Bangalore, Pune, Gurgaon, and Noida.
        </p>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-6 flex justify-between items-center bg-slate-900/10 p-3.5 rounded-2xl border border-white/[0.05] relative z-10">
        <span className="text-xs font-semibold text-slate-400">
          Showing {opportunities.length} internships
        </span>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="relative flex items-center gap-1.5 px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
        >
          <Filter size={12} className="text-cyan-400" />
          {showFilters ? "Hide Filters" : "Filter Options"}
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -left-2 bg-cyan-500 text-slate-950 text-[10px] font-extrabold h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-cyan-500/20 border border-slate-950">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start relative z-10">
        {/* Sidebar Filters */}
        <aside className={`relative ${showFilters ? "block" : "hidden"} lg:block rounded-2xl border border-white/[0.06] bg-slate-900/10 backdrop-blur-md p-6 space-y-6`}>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2.5 -left-2 bg-cyan-500 text-slate-950 text-[10px] font-extrabold h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-cyan-500/20 border border-slate-950">
              {activeFiltersCount}
            </span>
          )}
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-heading">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Clear All
            </button>
          </div>

          {/* Location filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-heading">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-semibold cursor-pointer"
            >
              <option value="">All Cities</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Gurgaon">Gurgaon / Delhi NCR</option>
              <option value="Noida">Noida</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          {/* Remote checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="remote-check"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="h-4 w-4 rounded-md border-white/10 bg-slate-950 text-cyan-500 focus:ring-cyan-500/55 cursor-pointer accent-cyan-500"
            />
            <label htmlFor="remote-check" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
              Remote Internships
            </label>
          </div>

          {/* Salary checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="salary-check"
              checked={onlyWithSalary}
              onChange={(e) => setOnlyWithSalary(e.target.checked)}
              className="h-4 w-4 rounded-md border-white/10 bg-slate-950 text-cyan-500 focus:ring-cyan-500/55 cursor-pointer accent-cyan-500"
            />
            <label htmlFor="salary-check" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
              Disclosed Stipend Only
            </label>
          </div>
        </aside>

        {/* Listings Content */}
        <main className="space-y-6">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-slate-900/30 border border-white/[0.06] rounded-2xl p-1.5 focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/25 transition-all duration-300">
            <div className="flex items-center flex-grow pl-3">
              <Search className="text-slate-500 mr-2 shrink-0" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search internship title, company, or tech stack..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none py-2 font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-cyan-500/10 hover:-translate-y-0.5"
            >
              Filter
            </button>
          </form>

          {/* Listings Loading / Items / Empty */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 w-full rounded-2xl border border-white/5 bg-slate-900/10 animate-pulse" />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-12 text-center text-slate-400">
              <AlertCircle className="mx-auto text-slate-500 mb-3" size={32} />
              <p className="text-sm font-bold text-white mb-1 font-heading">No internships found</p>
              <p className="text-xs text-slate-500 font-medium">Try broadening your search term or clearing filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <Link
                  key={opp.id}
                  href={`/jobs/${opp.id}`}
                  prefetch={false}
                  className="relative block p-6 rounded-2xl border border-white/[0.05] bg-slate-900/15 hover:bg-slate-900/35 hover:border-cyan-500/25 transition duration-200 hover:-translate-y-0.5 group shadow-sm hover:shadow-cyan-500/[0.02] pl-8 before:absolute before:left-0 before:top-5 before:bottom-5 before:w-[3.5px] before:rounded-r before:bg-emerald-500/30 group-hover:before:bg-emerald-400 group-hover:before:shadow-[0_0_8px_rgba(52,211,153,0.5)] before:transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 min-w-0 flex-1">
                      {opp.company.logo ? (
                        <div className="h-14 w-14 relative bg-slate-950 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-white/[0.06] transition group-hover:border-cyan-500/20 shadow-md">
                          <img src={opp.company.logo} alt={opp.company.name} className="max-h-full max-w-full object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition duration-250" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 bg-slate-950 border border-white/[0.06] rounded-xl flex items-center justify-center shrink-0 text-cyan-400 group-hover:border-cyan-500/20 group-hover:text-cyan-300 transition duration-250">
                          <Building2 size={20} className="text-slate-500 group-hover:text-cyan-400 transition" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition break-words line-clamp-2 leading-snug font-heading">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate">{opp.company.name}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3">
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold tracking-wide">
                            <MapPin size={10} className="text-cyan-500 shrink-0" />
                            {opp.location}
                          </span>
                          {opp.stipend && (
                            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                              {opp.stipend}
                            </span>
                          )}
                          {opp.duration && (
                            <span className="text-[10px] text-slate-400 bg-slate-950/40 px-2 py-0.5 border border-white/5 rounded-lg font-bold">
                              {opp.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:text-right shrink-0">
                      <span className="text-[9px] text-slate-600 block uppercase font-bold tracking-wider">Posted</span>
                      <span className="text-xs font-bold text-slate-400 mt-0.5">
                        {new Date(opp.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Skills tags list */}
                  {opp.skills && opp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/[0.04]">
                      {opp.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-slate-950 text-slate-400 px-2.5 py-1 rounded-lg border border-white/5 font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-6 mt-8">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchOpportunities(pagination.page - 1)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900/40 hover:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-white/5 cursor-pointer"
              >
                <ChevronLeft size={13} /> Previous
              </button>
              <span className="text-xs text-slate-500 font-semibold">
                Page <strong className="text-white">{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchOpportunities(pagination.page + 1)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900/40 hover:bg-slate-900/80 px-4 py-2.5 rounded-xl border border-white/5 cursor-pointer"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function InternshipsClientPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading internships...</div>}>
      <PageContentWrapper />
    </Suspense>
  );
}

function PageContentWrapper() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading internships...</div>}>
      <InternshipsPageContent />
    </Suspense>
  );
}
