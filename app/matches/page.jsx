"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../components/LayoutWrapper";
import { api } from "../../lib/api";
import Link from "next/link";
import { 
  Sparkles, Briefcase, MapPin, DollarSign, Check, Plus, X, 
  UploadCloud, LoaderCircle, CheckCircle, Building2, ChevronRight, AlertCircle
} from "lucide-react";

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

export default function MatchesPage() {
  const { user, authReady, profile, setProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState("form"); // "form" | "upload"
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [cityPreference, setCityPreference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState(null);
  const [activeCategory, setActiveCategory] = useState("jobs"); // "jobs" | "internships"
  
  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setSkills(profile.skills || []);
      setInterests(profile.interests || []);
      setExperienceYears(profile.experienceYears ?? 0);
      setCityPreference(profile.cityPreference ?? "");
      fetchMatches();
    }
  }, [profile]);

  const fetchMatches = async () => {
    try {
      const response = await api.get("/profile/matches");
      setMatches(response.data);
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
      if (setProfile) {
        setProfile(response.data.profile);
      }
      await fetchMatches();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      if (setProfile) {
        setProfile(response.data.profile);
      }
      
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

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoaderCircle className="animate-spin text-cyan-400" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 shadow-xl">
          <AlertCircle className="mx-auto text-cyan-400 mb-4" size={40} />
          <h2 className="text-xl font-bold mb-2">Access Restrained</h2>
          <p className="text-sm text-slate-400 mb-6">
            Please log in or sign up to personalize your profile and review specially curated opportunities.
          </p>
          <a
            href="#auth"
            className="inline-block bg-white text-slate-950 font-bold text-xs px-6 py-3 rounded-xl hover:bg-slate-200 transition cursor-pointer"
          >
            Log In / Sign Up
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      {/* Top Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Sparkles className="text-cyan-400 animate-pulse" size={24} />
            Your Specially Curated Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time developer jobs and internships matched to your skills, experience, and city preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
        {/* Left Column: Form / Upload Settings */}
        <aside className="rounded-2xl border border-white/10 bg-slate-900/20 p-4 sm:p-6 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Preferences Setup</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Customize skills and target locations</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Form / Upload Tab selector */}
          <div className="grid grid-cols-2 rounded-xl bg-slate-950 p-1 text-xs border border-white/5">
            <button
              onClick={() => setActiveTab("form")}
              className={`rounded-lg py-2 font-semibold transition ${
                activeTab === "form" ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Preferences Form
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`rounded-lg py-2 font-semibold transition ${
                activeTab === "upload" ? "bg-white text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              Upload Resume
            </button>
          </div>

          {activeTab === "form" ? (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Skills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-white/10 bg-slate-950/50 min-h-[44px]">
                  {skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium"
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
                    placeholder={skills.length === 0 ? "Type skill + Enter" : ""}
                    className="flex-grow bg-transparent text-xs text-white outline-none placeholder:text-slate-600 min-w-[80px]"
                  />
                </div>

                {/* Quick Add Suggestions */}
                <div className="mt-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Quick Add:</span>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_SKILLS.map((skill) => {
                      const isAdded = skills.some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <button
                          key={skill}
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddSkill(skill)}
                          className={`text-[9px] px-2 py-0.5 rounded border transition ${
                            isAdded 
                              ? "bg-slate-800/30 text-slate-600 border-transparent" 
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

              {/* Work Experience Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Work Experience
                </label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value={0}>Fresher / Less than 1 year</option>
                  <option value={1}>1 Year</option>
                  <option value={2}>2 Years</option>
                  <option value={3}>3+ Years</option>
                  <option value={5}>5+ Years</option>
                </select>
              </div>

              {/* Location Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  City Preference
                </label>
                <select
                  value={cityPreference}
                  onChange={(e) => setCityPreference(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
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

              {/* Roles / Interests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Roles
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {DOMAIN_ROLES.map((role) => {
                    const isSelected = interests.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleToggleInterest(role)}
                        className={`flex items-center justify-between text-[11px] px-2.5 py-2 rounded-lg border transition text-left ${
                          isSelected
                            ? "bg-white text-slate-950 border-white font-semibold"
                            : "border-white/5 bg-slate-950/40 text-slate-300 hover:border-white/10 hover:bg-slate-950/70"
                        }`}
                      >
                        <span className="truncate">{role}</span>
                        {isSelected ? <Check size={11} className="shrink-0" /> : <Plus size={11} className="opacity-40 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-white text-slate-950 font-bold text-xs py-3 rounded-xl hover:bg-slate-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting && <LoaderCircle size={14} className="animate-spin" />}
                Save Preferences
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition ${
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
                  <div className="text-center space-y-3">
                    <LoaderCircle size={32} className="text-cyan-400 animate-spin mx-auto" />
                    <div>
                      <p className="text-xs font-semibold text-white">Extracting qualifications...</p>
                      <div className="w-32 h-1 bg-slate-800 rounded-full mx-auto overflow-hidden mt-1.5">
                        <div 
                          className="h-full bg-cyan-500 transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <UploadCloud size={32} className="text-slate-500 mx-auto" />
                    <p className="text-xs font-semibold">Drag & Drop Resume</p>
                    <p className="text-[10px] text-slate-500">Supports PDF, DOCX or DOC</p>
                  </div>
                )}
              </div>

              {uploadFile && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/50">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-xs text-white truncate font-medium">{uploadFile.name}</span>
                  </div>
                  <button 
                    onClick={() => setUploadFile(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Right Column: Matched Listings Dashboard */}
        <main className="space-y-6">
          {/* Match Category Switcher Tabs */}
          <div className="flex border-b border-white/10 shrink-0">
            <button
              onClick={() => setActiveCategory("jobs")}
              className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-semibold transition border-b-2 -mb-px ${
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
              onClick={() => setActiveCategory("internships")}
              className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-semibold transition border-b-2 -mb-px ${
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

          {/* List items rendering */}
          <div className="space-y-4">
            {activeCategory === "jobs" ? (
              matches?.jobs?.length > 0 ? (
                matches.jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-slate-900/10 hover:bg-slate-900/30 transition group"
                  >
                    <div className="flex gap-4 min-w-0 flex-1">
                      {job.company?.logo ? (
                        <div className="h-14 w-14 relative bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10 transition group-hover:border-cyan-500/50">
                          <img src={job.company.logo} alt={job.company.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-md shadow-cyan-500/10">
                          <Building2 size={22} className="text-cyan-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition break-words line-clamp-2 leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{job.company?.name || "Unknown Company"}</p>
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
                <div className="text-center py-16 bg-slate-900/10 rounded-2xl border border-white/5 text-slate-500 text-xs">
                  <Briefcase className="mx-auto text-slate-600 mb-3" size={28} />
                  No matching jobs found. Try expanding your skills/interests or modifying experience levels.
                </div>
              )
            ) : (
              matches?.internships?.length > 0 ? (
                matches.internships.map((internship) => (
                  <div 
                    key={internship.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-slate-900/10 hover:bg-slate-900/30 transition group"
                  >
                    <div className="flex gap-4 min-w-0 flex-1">
                      {internship.company?.logo ? (
                        <div className="h-14 w-14 relative bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10 transition group-hover:border-cyan-500/50">
                          <img src={internship.company.logo} alt={internship.company.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-md shadow-cyan-500/10">
                          <Building2 size={22} className="text-cyan-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition break-words line-clamp-2 leading-snug">
                          {internship.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{internship.company?.name || "Unknown Company"}</p>
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
                <div className="text-center py-16 bg-slate-900/10 rounded-2xl border border-white/5 text-slate-500 text-xs">
                  <Briefcase className="mx-auto text-slate-600 mb-3" size={28} />
                  No matching internships found. Try expanding your skills/interests or modifying experience levels.
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
