"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserCircle, Briefcase, Award, Hammer, FileText } from "lucide-react";

export function Navbar({ user, authReady = true, onSignOut }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Internships", path: "/internships", icon: FileText },
    { name: "Hackathons", path: "/hackathons", icon: Award },
    { name: "Tools", path: "/tools", icon: Hammer },
  ];

  return (
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
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/20 hover:text-red-400 transition py-1.5 px-3 text-[11px] font-bold text-slate-300 cursor-pointer group"
              title="Sign Out"
            >
              <UserCircle size={14} className="shrink-0 text-cyan-400 group-hover:text-cyan-300 transition" />
              <span className="max-w-[90px] xs:max-w-[120px] truncate">{user.email}</span>
              <LogOut size={13} className="shrink-0 text-slate-400 group-hover:text-red-400 transition ml-1" />
            </button>
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

      {/* Mobile sub-navigation bar (Horizontal slider on small screens) */}
      <div className="flex md:hidden items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2.5 border-t border-white/5 bg-slate-950 scrollbar-none justify-start sm:justify-center">
        <Link
          href="/"
          className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${
            pathname === "/" ? "bg-white/10 text-cyan-400" : "text-slate-400 hover:text-white"
          }`}
        >
          Home
        </Link>
        {navLinks.map((link) => {
          const isActive = pathname?.startsWith(link.path);
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`text-[11px] font-bold px-3 py-1 rounded-lg transition ${
                isActive ? "bg-white/10 text-cyan-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
