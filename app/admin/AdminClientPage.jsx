"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../components/LayoutWrapper.jsx";
import Link from "next/link";
import { RefreshCw, Play, AlertCircle, FileText, CheckCircle, Database, Server } from "lucide-react";

export default function AdminClientPage() {
  const { user, authReady } = useAuth();
  
  // Crawler status states
  const [crawlerInfo, setCrawlerInfo] = useState({
    isCrawling: false,
    lastRun: null,
    jobsScraped: 0,
    internshipsScraped: 0,
    failedUrls: [],
    logs: []
  });
  const [crawlerLoading, setCrawlerLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    type: "JOB",
    companyName: "",
    title: "",
    location: "",
    salary: "",
    experience: "",
    skills: "",
    description: "",
    applyUrl: "",
    organizer: "",
    prizePool: "",
    deadline: "",
    mode: "Online",
    teamSize: "1-4 members"
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const ADMIN_EMAILS = ["admin@fresherr.in", "suryansh@fresherr.in", "adhikary.sur@gmail.com"]; // Extend to user testing emails if needed

  const fetchCrawlerStatus = async () => {
    try {
      const response = await fetch("/api/admin/crawler");
      if (response.ok) {
        const data = await response.json();
        setCrawlerInfo(data);
      }
    } catch (error) {
      console.error("[Admin] Failed to fetch crawler status:", error.message);
    } finally {
      setCrawlerLoading(false);
    }
  };

  useEffect(() => {
    if (authReady && user && ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
      fetchCrawlerStatus();
      // Poll every 5 seconds if crawler is crawling
      const interval = setInterval(() => {
        fetchCrawlerStatus();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [authReady, user]);

  const handleTriggerCrawler = async () => {
    setTriggering(true);
    try {
      const response = await fetch("/api/admin/crawler", { method: "POST" });
      const data = await response.json();
      alert(data.message);
      fetchCrawlerStatus();
    } catch (error) {
      alert("Failed to start crawler: " + error.message);
    } finally {
      setTriggering(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess("");
    setFormError("");

    try {
      const response = await fetch("/api/admin/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit opportunity.");
      }

      setFormSuccess(data.message);
      // Reset form fields
      setFormData({
        type: formData.type,
        companyName: "",
        title: "",
        location: "",
        salary: "",
        experience: "",
        skills: "",
        description: "",
        applyUrl: "",
        organizer: "",
        prizePool: "",
        deadline: "",
        mode: "Online",
        teamSize: "1-4 members"
      });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Authorization checks
  if (!authReady) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="animate-spin text-cyan-400 mb-3" size={24} />
        <span className="text-xs">Checking authorization privileges...</span>
      </div>
    );
  }

  const isAdmin = user && ADMIN_EMAILS.includes(user.email?.toLowerCase());

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-2xl border border-red-500/20 bg-red-500/5 text-center text-slate-400">
        <AlertCircle className="mx-auto text-red-500 mb-3 animate-bounce" size={40} />
        <h1 className="text-lg font-bold text-white mb-2">Access Denied</h1>
        <p className="text-xs text-slate-500 mb-6">
          You must be signed in with an authorized administrator account to access this page. Current: {user ? user.email : "Not signed in"}
        </p>
        <Link href="/auth" className="inline-block bg-white text-slate-950 font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-slate-200 transition">
          Sign In as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Server className="text-cyan-400" size={28} />
          Admin Control Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor background crawler statistics, view failure logs, and manually insert fresh postings.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Scraper Dashboard Column */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Background Scraper Status</h2>
          
          <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/10 space-y-6">
            {/* Status indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`h-3 w-3 rounded-full ${crawlerInfo.isCrawling ? "bg-cyan-400 animate-ping" : "bg-slate-500"}`} />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Crawler State: {crawlerInfo.isCrawling ? "ACTIVE" : "IDLE"}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Last Run: {crawlerInfo.lastRun ? new Date(crawlerInfo.lastRun).toLocaleString("en-IN") : "Never"}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleTriggerCrawler}
                disabled={crawlerInfo.isCrawling || triggering}
                className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <Play size={12} /> Trigger Crawler
              </button>
            </div>

            {/* Counts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Jobs Scraped</span>
                <span className="text-2xl font-bold text-white mt-1 block">{crawlerInfo.jobsScraped}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Internships Scraped</span>
                <span className="text-2xl font-bold text-white mt-1 block">{crawlerInfo.internshipsScraped}</span>
              </div>
            </div>

            {/* Crawler Logs Console */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">Activity Logs (Latest 10)</span>
              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-[10px] text-cyan-400 h-64 overflow-y-auto space-y-1.5">
                {crawlerInfo.logs.slice(-10).map((log, idx) => (
                  <div key={idx} className="leading-relaxed border-b border-white/5 pb-1">
                    {log}
                  </div>
                ))}
                {crawlerInfo.logs.length === 0 && (
                  <div className="text-slate-600 text-center py-24">No active logs. Click trigger to start.</div>
                )}
              </div>
            </div>

            {/* Failed URLs logs */}
            {crawlerInfo.failedUrls.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Crawler Failures ({crawlerInfo.failedUrls.length})
                </span>
                <div className="overflow-hidden border border-red-500/10 rounded-xl bg-red-500/5 max-h-40 overflow-y-auto">
                  <table className="min-w-full divide-y divide-red-500/10 text-left text-[10px] text-red-300">
                    <thead>
                      <tr className="bg-red-500/10 text-red-400 font-bold">
                        <th className="px-3 py-2">Feed URL</th>
                        <th className="px-3 py-2">Error</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-500/10">
                      {crawlerInfo.failedUrls.map((fail, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5 font-bold truncate max-w-xs">{fail.url}</td>
                          <td className="px-3 py-1.5 text-red-400/70">{fail.error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Manual Addition Form Column */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-2">Manually Add Opportunity</h2>

          <form onSubmit={handleFormSubmit} className="p-6 rounded-2xl border border-white/10 bg-slate-900/10 space-y-4">
            {formSuccess && (
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle size={14} /> {formSuccess}
              </div>
            )}
            {formError && (
              <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={14} /> {formError}
              </div>
            )}

            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/5">
              {["JOB", "INTERNSHIP", "HACKATHON"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, type: t }))}
                  className={`text-[10px] sm:text-xs py-2 rounded-lg font-bold transition cursor-pointer ${
                    formData.type === t ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Conditional Form Inputs */}
            {formData.type === "HACKATHON" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Hackathon Name</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. HackIndia 2026"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Organizer</label>
                    <input
                      type="text"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Devfolio"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Prize Pool</label>
                    <input
                      type="text"
                      name="prizePool"
                      value={formData.prizePool}
                      onChange={handleFormChange}
                      placeholder="e.g. ₹5,00,000"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Registration Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Mode</label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleFormChange}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Job/Internship Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Software Engineer - React"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Google India"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Bangalore"
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-semibold">
                      {formData.type === "JOB" ? "Salary Range" : "Stipend"}
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleFormChange}
                      placeholder={formData.type === "JOB" ? "e.g. 6-8 LPA" : "e.g. ₹25,000/mo"}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  {formData.type === "JOB" && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase font-semibold">Experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleFormChange}
                        placeholder="e.g. 0-2 years"
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">Skills (Comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleFormChange}
                    placeholder="React, JavaScript, Redux, HTML"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </>
            )}

            {/* Generic URL input */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">
                {formData.type === "HACKATHON" ? "Registration Link" : "Application URL"}
              </label>
              <input
                type="url"
                name="applyUrl"
                value={formData.applyUrl}
                onChange={handleFormChange}
                required
                placeholder="https://company.com/apply"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Description / Details</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                required
                rows={5}
                placeholder="Enter details of the opportunity (HTML or plaintext support)..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 resize-y"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-slate-950 font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {formLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={14} /> Submitting...
                </>
              ) : (
                <>
                  <Database size={14} /> Save Opportunity
                </>
              )}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
