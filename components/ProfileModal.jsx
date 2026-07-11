"use client";

import { useEffect, useState, useRef } from "react";
import { X, UploadCloud, Briefcase, Plus, Check, Sparkles, MapPin, DollarSign, LoaderCircle, CheckCircle, Building2 } from "lucide-react";
import Link from "next/link";
import { api } from "../lib/api";

const DOMAIN_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Software Engineer",
  "AI / ML Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile App Developer",
  "UI/UX Designer",
  "Product Manager",
];

const SUGGESTED_SKILLS = [
  "React", "Node.js", "Python", "JavaScript", "TypeScript", "Java", 
  "SQL", "Git", "Docker", "AWS", "Next.js", "TailwindCSS", "MongoDB", "C++"
];

export function ProfileModal({ isOpen, onClose, user, onProfileSaved, currentProfile }) {
  const [activeTab, setActiveTab] = useState("form"); // "form" | "upload"
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [cityPreference, setCityPreference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState(null);
  const [viewingMatches, setViewingMatches] = useState(false);
  const [activeCategory, setActiveCategory] = useState("jobs"); // "jobs" | "internships"

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setUploadFile(null);
      setUploadProgress(0);
      
      if (currentProfile) {
        setSkills(currentProfile.skills || []);
        setInterests(currentProfile.interests || []);
        setExperienceYears(currentProfile.experienceYears ?? 0);
        setCityPreference(currentProfile.cityPreference ?? "");
        if ((currentProfile.skills || []).length > 0 || (currentProfile.interests || []).length > 0) {
          fetchMatches();
        } else {
          setViewingMatches(false);
          setMatches(null);
        }
      } else {
        setSkills([]);
        setInterests([]);
        setExperienceYears(0);
        setCityPreference("");
        setViewingMatches(false);
        setMatches(null);
      }
    }
  }, [isOpen, currentProfile]);

  const fetchMatches = async () => {
    try {
      const response = await api.get("/profile/matches");
      setMatches(response.data);
      setViewingMatches(true);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    }
  };

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, idx) => idx !== indexToRemove));
  };

  const handleToggleInterest = (role) => {
    if (interests.includes(role)) {
      setInterests(interests.filter(i => i !== role));
    } else {
      setInterests([...interests, role]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (skills.length === 0 && interests.length === 0) {
      setError("Please add at least one skill or interest to curate matches.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/profile", {
        skills,
        interests,
        experienceYears,
        cityPreference,
        hasSkipped: false,
      });
      if (onProfileSaved) {
        onProfileSaved(response.data.profile);
      }
      await fetchMatches();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      const response = await api.post("/profile", {
        skills: currentProfile?.skills || [],
        interests: currentProfile?.interests || [],
        hasSkipped: true,
      });
      if (onProfileSaved) {
        onProfileSaved(response.data.profile);
      }
    } catch (err) {
      console.warn("Skip save failed:", err);
    }
    onClose();
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleResumeUpload(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleResumeUpload(files[0]);
    }
  };

  const handleResumeUpload = async (file) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "doc"].includes(ext)) {
      setError("Unsupported file format. Please upload PDF, DOCX, or DOC.");
      return;
    }

    setUploadFile(file);
    setIsSubmitting(true);
    setError("");
    setUploadProgress(15);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      setUploadProgress(40);
      const response = await api.post("/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const pct = 40 + Math.round((progressEvent.loaded / progressEvent.total) * 40);
            setUploadProgress(pct);
          }
        }
      });
      
      setUploadProgress(100);
      if (onProfileSaved) {
        onProfileSaved(response.data.profile);
      }
      
      // Refresh form elements with extracted values
      setSkills(response.data.profile.skills || []);
      setInterests(response.data.profile.interests || []);
      setExperienceYears(response.data.profile.experienceYears ?? 0);
      setCityPreference(response.data.profile.cityPreference ?? "");
      
      await fetchMatches();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process resume. Please try filling the form manually.");
      setUploadFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="profile-modal"
        className="relative w-full sm:max-w-3xl h-[100dvh] sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-[2rem] border-0 sm:border border-white/10 bg-slate-950 sm:bg-slate-900/90 p-4 sm:p-8 shadow-2xl backdrop-blur-md overflow-hidden flex flex-col text-white"
      >
        {/* Top Gradient Accents */}
        <div className="absolute top-0 left-1/4 h-24 w-1/2 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between mb-6 shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles size={20} className="text-cyan-400 animate-pulse" />
              Personalize Your Career Matches
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Curate entry-level software engineering jobs, internships, and tech roles catered precisely to you.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {!viewingMatches ? (
            <>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 rounded-2xl bg-slate-950/60 p-1 text-sm mb-6 shrink-0 border border-white/5">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className={`rounded-xl py-2.5 font-semibold transition ${
                    activeTab === "form" ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Fill Form Manually
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`rounded-xl py-2.5 font-semibold transition ${
                    activeTab === "upload" ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Upload Resume
                </button>
              </div>

              {activeTab === "form" ? (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Skills Section */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Key Skills
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl border border-white/10 bg-slate-950/50 min-h-[48px] focus-within:border-cyan-500/50 transition">
                      {skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium"
                        >
                          {skill}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSkill(index)}
                            className="text-cyan-500 hover:text-cyan-300 font-bold ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            handleAddSkill(skillInput);
                          }
                        }}
                        placeholder={skills.length === 0 ? "Type skill and press Enter or comma (e.g. Java)" : ""}
                        className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-600 min-w-[120px] py-0.5"
                      />
                    </div>

                    {/* Suggestions */}
                    <div className="mt-2.5">
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1.5">Popular Skills:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_SKILLS.map((skill) => {
                          const isAdded = skills.some(s => s.toLowerCase() === skill.toLowerCase());
                          return (
                            <button
                              key={skill}
                              type="button"
                              disabled={isAdded}
                              onClick={() => handleAddSkill(skill)}
                              className={`text-[10px] px-2.5 py-1 rounded-lg border transition ${
                                isAdded 
                                  ? "bg-slate-800/30 text-slate-600 border-transparent cursor-not-allowed" 
                                  : "border-white/5 bg-slate-900 text-slate-400 hover:border-cyan-500/30 hover:text-white"
                              }`}
                            >
                              + {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Interests Section */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Roles & Interests
                    </label>
                    <p className="text-xs text-slate-500 mb-3">Select the roles you are actively targetting:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {DOMAIN_ROLES.map((role) => {
                        const isSelected = interests.includes(role);
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleToggleInterest(role)}
                            className={`flex items-center justify-between text-xs px-3.5 py-2.5 rounded-xl border transition text-left ${
                              isSelected
                                ? "bg-white text-slate-950 border-white font-semibold"
                                : "border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/10 hover:bg-slate-950/70"
                            }`}
                          >
                            <span>{role}</span>
                            {isSelected ? <Check size={14} /> : <Plus size={14} className="opacity-40" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Experience and Location Preferences */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {/* Work Experience */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                        Work Experience
                      </label>
                      <select
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                      >
                        <option value={0}>Fresher / Less than 1 year</option>
                        <option value={1}>1 Year</option>
                        <option value={2}>2 Years</option>
                        <option value={3}>3+ Years</option>
                        <option value={5}>5+ Years</option>
                      </select>
                    </div>

                    {/* City Preference */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                        City Preference
                      </label>
                      <select
                        value={cityPreference}
                        onChange={(e) => setCityPreference(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                      >
                        <option value="">Any City / Not Specified</option>
                        <option value="Bangalore">Bangalore / Bengaluru</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Gurgaon">Gurgaon / Delhi NCR</option>
                        <option value="Noida">Noida</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Remote">Remote Only</option>
                      </select>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[1.5rem] p-10 cursor-pointer transition ${
                      isDragging 
                        ? "border-cyan-500 bg-cyan-500/5 text-cyan-400" 
                        : "border-white/10 bg-slate-950/20 hover:border-cyan-500/30 hover:bg-slate-950/40 text-slate-300"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                    />
                    
                    {isSubmitting ? (
                      <div className="text-center space-y-4">
                        <LoaderCircle size={40} className="text-cyan-400 animate-spin mx-auto" />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-white">Extracting details from resume...</p>
                          <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                            <div 
                              className="h-full bg-cyan-500 transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-400 border border-white/5">
                          <UploadCloud size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">Drag & drop your resume here</p>
                          <p className="text-xs text-slate-500 mt-1">or click to browse from device</p>
                        </div>
                        <p className="text-[10px] text-slate-600">Supports PDF, DOCX or DOC up to 10MB</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-slate-950/40 p-4 text-xs text-slate-400 leading-relaxed">
                    💡 <strong>How it works:</strong> Our parser will extract your experience, technical expertise, and career focus areas, creating a custom query matching profiles against our database to find the best internships and entry-level positions.
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Matches Display State */
            <div className="space-y-6">
              {/* Profile Summary Badge panel */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-white/5 bg-slate-950/40 shrink-0">
                <div className="space-y-1">
                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">My Skills:</span>
                    <span>{skills.slice(0, 8).join(", ")}{skills.length > 8 && "..."}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">My Interests:</span>
                    <span>{interests.slice(0, 4).join(", ")}{interests.length > 4 && "..."}</span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingMatches(false)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                >
                  Edit Profile / Re-upload
                </button>
              </div>

              {/* Match Tabs */}
              <div className="flex border-b border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveCategory("jobs")}
                  className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold transition border-b-2 -mb-px ${
                    activeCategory === "jobs" 
                      ? "border-cyan-400 text-cyan-400 font-bold" 
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Briefcase size={14} />
                  Curated Jobs
                  {matches?.jobs?.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 font-bold border border-cyan-400/20">
                      {matches.jobs.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("internships")}
                  className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold transition border-b-2 -mb-px ${
                    activeCategory === "internships" 
                      ? "border-cyan-400 text-cyan-400 font-bold" 
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Briefcase size={14} />
                  Curated Internships
                  {matches?.internships?.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 font-bold border border-cyan-400/20">
                      {matches.internships.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Match Opportunities List */}
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {activeCategory === "jobs" ? (
                  matches?.jobs?.length > 0 ? (
                    matches.jobs.map((job) => (
                      <div 
                        key={job.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-slate-950/20 hover:bg-slate-950/40 transition group"
                      >
                        <div className="flex gap-3 min-w-0 flex-1">
                          {job.company.logo ? (
                            <div className="h-14 w-14 relative bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10 transition group-hover:border-cyan-500/50">
                              <img src={job.company.logo} alt={job.company.name} className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : (
                            <div className="h-14 w-14 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-md shadow-cyan-500/10">
                              <Building2 size={22} className="text-cyan-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition break-words line-clamp-2 leading-snug">
                              {job.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{job.company.name}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                <MapPin size={10} className="text-cyan-500" />
                                {job.location}
                              </span>
                              {job.salary && (
                                <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-semibold">
                                  <DollarSign size={10} />
                                  {job.salary}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full sm:w-auto border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {job.matchPercentage}% Match
                          </span>
                          <Link
                            href={`/jobs/${job.id}`}
                            target="_blank"
                            className="bg-white text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-slate-200 transition"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No matching jobs found. Try expanding your skills and interests.
                    </div>
                  )
                ) : (
                  matches?.internships?.length > 0 ? (
                    matches.internships.map((internship) => (
                      <div 
                        key={internship.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-slate-950/20 hover:bg-slate-950/40 transition group"
                      >
                        <div className="flex gap-3 min-w-0 flex-1">
                          {internship.company.logo ? (
                            <div className="h-14 w-14 relative bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10 transition group-hover:border-cyan-500/50">
                              <img src={internship.company.logo} alt={internship.company.name} className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : (
                            <div className="h-14 w-14 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-md shadow-cyan-500/10">
                              <Building2 size={22} className="text-cyan-400" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition break-words line-clamp-2 leading-snug">
                              {internship.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{internship.company.name}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                <MapPin size={10} className="text-cyan-500" />
                                {internship.location}
                              </span>
                              {internship.stipend && (
                                <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-semibold">
                                  <DollarSign size={10} />
                                  {internship.stipend}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full sm:w-auto border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                          <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {internship.matchPercentage}% Match
                          </span>
                          <Link
                            href={`/jobs/${internship.id}`}
                            target="_blank"
                            className="bg-white text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-slate-200 transition"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No matching internships found. Try expanding your skills and interests.
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          {!viewingMatches ? (
            <>
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Skip for now
              </button>

              {activeTab === "form" ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleFormSubmit}
                  className="flex items-center justify-center gap-2 bg-white text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <LoaderCircle size={14} className="animate-spin" />}
                  Get Career Matches
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 bg-white text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-200 transition"
                >
                  Browse File
                </button>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle size={14} className="text-emerald-400" />
                Profile configured successfully.
              </div>
              <button
                type="button"
                onClick={onClose}
                className="bg-white text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-200 transition"
              >
                Close Window
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
