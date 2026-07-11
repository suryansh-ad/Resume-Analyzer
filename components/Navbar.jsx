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
    { name: "Matches", path: "/matches", icon: Sparkles },
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
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/frr-logo.jpeg"
              alt="Fresherr logo"
              width={40}
              height={40}
              priority
              className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-cyan-500/20"
            />
            <div>
              <p className="text-lg font-bold tracking-tight text-white">
                Fresherr<span className="text-cyan-400">.in</span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">India's Career Platform</p>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition ${
                pathname === "/" ? "text-cyan-400 font-semibold" : "text-slate-300 hover:text-white"
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
                  className={`flex items-center gap-1.5 text-sm font-medium transition ${
                    isActive ? "text-cyan-400 font-semibold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Icon size={14} className="opacity-80" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User / Sign In Action */}
          <div className="flex items-center gap-4">
            {!authReady ? (
              <div aria-hidden="true" className="h-9 w-20 rounded-lg border border-white/10 bg-white/5 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/matches")}
                  className={`hidden md:flex relative items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                    hasProfile 
                      ? "border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50" 
                      : "border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50"
                  }`}
                >
                  <Sparkles size={12} className={hasProfile ? "text-cyan-400 animate-pulse" : "text-amber-400 animate-bounce"} />
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
                  className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/20 hover:text-red-400 transition py-1.5 px-3 text-[11px] font-bold text-slate-300 cursor-pointer group"
                  title="Sign Out"
                >
                  <UserCircle size={14} className="shrink-0 text-cyan-400 group-hover:text-cyan-300 transition" />
                  <span className="max-w-[70px] xs:max-w-[100px] truncate">{user.email}</span>
                  <LogOut size={13} className="shrink-0 text-slate-400 group-hover:text-red-400 transition ml-1" />
                </button>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex md:hidden items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/20 hover:text-red-400 transition p-2 text-slate-300 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={16} className="text-slate-400" />
                </button>
              </div>
            ) : (
              <Link
                href="#auth"
                className="rounded-lg bg-cyan-500 hover:bg-cyan-600 px-4 py-1.5 text-xs font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Sticky Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-t border-white/10 py-1.5 flex md:hidden justify-around items-center">
        {bottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.path === "/" 
            ? pathname === "/" 
            : pathname?.startsWith(tab.path);
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition ${
                isActive ? "text-cyan-400" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={18} className={isActive ? "text-cyan-400" : "text-slate-400"} />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
