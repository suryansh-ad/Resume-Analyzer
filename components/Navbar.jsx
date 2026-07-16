"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserCircle, Briefcase, Award, Hammer, FileText, Sparkles, Home } from "lucide-react";
import { useAuth } from "./LayoutWrapper";

export function Navbar({ user, authReady = true, onSignOut }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  const hasProfile = profile && ((profile.skills || []).length > 0 || (profile.interests || []).length > 0);

  const bottomTabs = [
    { name: "Home", path: "/", icon: Home },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Internships", path: "/internships", icon: FileText },
    { name: "Hackathons", path: "/hackathons", icon: Award },
    { name: "Tools", path: "/tools", icon: Hammer },
  ];

  const navLinks = [
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Internships", path: "/internships", icon: FileText },
    { name: "Hackathons", path: "/hackathons", icon: Award },
    { name: "Matches", path: "/matches", icon: Sparkles },
    { name: "Tools", path: "/tools", icon: Hammer },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/70 backdrop-blur-xl shadow-lg shadow-black/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/frr-logo.jpeg"
              alt="Fresherr logo"
              width={38}
              height={38}
              priority
              className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-cyan-500/10 transition duration-300 group-hover:scale-102"
            />
            <div>
              <p className="text-md font-bold tracking-tight text-white font-heading">
                Fresherr<span className="text-cyan-400">.in</span>
              </p>
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider hidden sm:block">India's Career Platform</p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-205 ${
                pathname === "/" 
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                  : "text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent"
              }`}
            >
              Home
            </Link>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname?.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-205 ${
                    isActive 
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                      : "text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent"
                  }`}
                >
                  <Icon size={13} className="opacity-90 shrink-0" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User / Sign In Action */}
          <div className="flex items-center gap-4">
            {!authReady ? (
              <div aria-hidden="true" className="h-9 w-20 rounded-xl border border-white/5 bg-white/5 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/matches")}
                  className={`hidden md:flex relative items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[10px] font-bold tracking-wide uppercase transition-all duration-205 cursor-pointer ${
                    hasProfile 
                      ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/30" 
                      : "border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/30 animate-pulse-soft"
                  }`}
                >
                  <Sparkles size={11} className={hasProfile ? "text-cyan-400" : "text-amber-400"} />
                  <span>{hasProfile ? "Career Matches" : "Complete Profile"}</span>
                  {!hasProfile && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all duration-205 py-1.5 px-3.5 text-[10px] font-bold text-slate-300 cursor-pointer group"
                  title="Sign Out"
                >
                  <UserCircle size={13} className="shrink-0 text-cyan-400 group-hover:text-cyan-300 transition" />
                  <span className="max-w-[70px] xs:max-w-[100px] truncate">{user.email}</span>
                  <LogOut size={12} className="shrink-0 text-slate-500 group-hover:text-red-400 transition ml-1" />
                </button>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex md:hidden items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all duration-205 p-2 text-slate-300 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={15} className="text-slate-400" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-6 py-2.5 text-sm font-bold text-slate-950 transition-all duration-205 hover:-translate-y-0.5 shadow-lg shadow-cyan-500/10 cursor-pointer"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Sticky Mobile Bottom Navigation Bar - Floating Glass Dock */}
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-slate-950/80 backdrop-blur-xl border border-white/[0.08] py-2 px-1 flex md:hidden justify-around items-center rounded-2xl shadow-2xl shadow-black/60">
        {bottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.path === "/" 
            ? pathname === "/" 
            : pathname?.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 text-[9px] font-bold tracking-wide uppercase transition-all duration-205 ${
                isActive ? "text-cyan-400 scale-105" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon size={17} className={isActive ? "text-cyan-400" : "text-slate-500"} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
