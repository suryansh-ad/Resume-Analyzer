"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Briefcase, Calendar, ChevronLeft, ChevronRight, X, AlertCircle, Filter, Building2 } from "lucide-react";

function JobsPageContent() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [opportunityType, setOpportunityType] = useState(searchParams.get("type") || "job"); // job | internship
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "");
  const [isRemote, setIsRemote] = useState(searchParams.get("remote") === "true");
  const [experienceFilter, setExperienceFilter] = useState(searchParams.get("experience") || "");
  const [onlyWithSalary, setOnlyWithSalary] = useState(true);
  
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchOpportunities = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: opportunityType,
        search: searchQuery,
        location: locationFilter,
        remote: isRemote ? "true" : "false",
        experience: opportunityType === "job" ? experienceFilter : "",
        hasSalaryOnly: onlyWithSalary ? "true" : "false",
        page: pageNumber.toString(),
        limit: "10"
      });

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch opportunities");
      }
      const data = await response.json();
      setOpportunities(data.data || []);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages || 1
      });
    } catch (error) {
      console.error("[Fetch Jobs] Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Re-fetch on filter change
    fetchOpportunities(1);
  }, [opportunityType, locationFilter, isRemote, experienceFilter, onlyWithSalary]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOpportunities(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setIsRemote(false);
    setExperienceFilter("");
    setOpportunityType("job");
    setOnlyWithSalary(false);
  };

  const activeFiltersCount = 
    (locationFilter ? 1 : 0) +
    (isRemote ? 1 : 0) +
    (opportunityType === "job" && experienceFilter ? 1 : 0) +
    (onlyWithSalary ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Discover {opportunityType === "job" ? "Jobs" : "Internships"} in India
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore and apply for verified fresh graduate roles. All listings are 100% verified for candidates residing in India.
        </p>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-6 flex justify-between items-center bg-slate-900/10 p-3.5 rounded-2xl border border-white/5">
        <span className="text-xs font-semibold text-slate-400">
          Showing {opportunities.length} opportunities
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

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className={`relative ${showFilters ? "block" : "hidden"} lg:block rounded-2xl border border-white/10 bg-slate-900/20 p-6 space-y-6`}>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2.5 -left-2 bg-cyan-500 text-slate-950 text-[10px] font-extrabold h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-cyan-500/20 border border-slate-950">
              {activeFiltersCount}
            </span>
          )}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Job vs Internship Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Opportunity Type</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/5">
              <button
                onClick={() => setOpportunityType("job")}
                className={`text-xs py-2 rounded-lg font-bold transition cursor-pointer ${
                  opportunityType === "job" ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => setOpportunityType("internship")}
                className={`text-xs py-2 rounded-lg font-bold transition cursor-pointer ${
                  opportunityType === "internship" ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                Internships
              </button>
            </div>
          </div>

          {/* Location filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Location</label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
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
              className="h-4 w-4 rounded border-white/10 bg-slate-950 text-cyan-500 focus:ring-cyan-500/50"
            />
            <label htmlFor="remote-check" className="text-xs font-medium text-slate-300 cursor-pointer">
              Remote Opportunities
            </label>
          </div>

          {/* Salary checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="salary-check"
              checked={onlyWithSalary}
              onChange={(e) => setOnlyWithSalary(e.target.checked)}
              className="h-4 w-4 rounded border-white/10 bg-slate-950 text-cyan-500 focus:ring-cyan-500/50"
            />
            <label htmlFor="salary-check" className="text-xs font-medium text-slate-300 cursor-pointer">
              Disclosed Salary Only
            </label>
          </div>

          {/* Experience filter (Jobs only) */}
          {opportunityType === "job" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Experience</label>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="">Any Experience</option>
                <option value="0-0 years">Freshers (0-0 yrs)</option>
                <option value="0-1 years">0 - 1 years</option>
                <option value="0-2 years">0 - 2 years</option>
                <option value="1-3 years">1 - 3 years</option>
              </select>
            </div>
          )}
        </aside>

        {/* Listings Content */}
        <main className="space-y-6">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-slate-900/30 border border-white/10 rounded-2xl p-1.5 focus-within:border-cyan-500/30 transition">
            <div className="flex items-center flex-grow pl-3">
              <Search className="text-slate-400 mr-2 shrink-0" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, company, or tech stack..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer"
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
              <p className="text-sm font-bold text-white mb-1">No opportunities found</p>
              <p className="text-xs text-slate-500">Try broadening your search term or clearing filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <Link
                  key={opp.id}
                  href={`/jobs/${opp.id}`}
                  className="block p-6 rounded-2xl border border-white/5 bg-slate-900/10 hover:bg-slate-900/30 hover:border-cyan-500/20 transition group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      {opp.company.logo ? (
                        <div className="h-14 w-14 relative bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10 transition group-hover:border-cyan-500/50">
                          <img src={opp.company.logo} alt={opp.company.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-md shadow-cyan-500/10">
                          <Building2 size={22} className="text-cyan-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition">
                          {opp.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{opp.company.name}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3">
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                            <MapPin size={11} className="text-cyan-500" />
                            {opp.location}
                          </span>
                          {opp.salary && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                              {opp.salary}
                            </span>
                          )}
                          {opp.stipend && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                              {opp.stipend}
                            </span>
                          )}
                          {(opp.experience || opp.duration) && (
                            <span className="text-[11px] text-slate-500 bg-white/5 px-2 py-0.5 rounded font-medium">
                              {opp.experience || opp.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:text-right shrink-0">
                      <span className="text-xs text-slate-500 block">Posted</span>
                      <span className="text-xs font-bold text-slate-300 mt-0.5">
                        {new Date(opp.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Skills tags list */}
                  {opp.skills && opp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                      {opp.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-slate-950 text-slate-400 px-2 py-1 rounded-md border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                      {opp.skills.length > 5 && (
                        <span className="text-[10px] text-slate-500 px-1 py-1 font-medium">
                          +{opp.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchOpportunities(pagination.page - 1)}
                className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900/40 px-4 py-2 rounded-xl border border-white/5"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="text-xs text-slate-400">
                Page <strong className="text-white">{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchOpportunities(pagination.page + 1)}
                className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900/40 px-4 py-2 rounded-xl border border-white/5"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-400">Loading jobs...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}
