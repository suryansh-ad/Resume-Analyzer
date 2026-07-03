"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserCircle, Briefcase, Award, Code, Hammer, FileText } from "lucide-react";

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

        {/* Center Navigation Links */}
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
          {/* Mobile navigation links shortcut */}
          <div className="flex md:hidden items-center gap-3 mr-2">
            {navLinks.slice(0, 3).map((link) => {
              const isActive = pathname?.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xs font-semibold px-2 py-1 rounded-md transition ${
                    isActive ? "bg-white/10 text-cyan-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {!authReady ? (
            <div aria-hidden="true" className="h-9 w-20 rounded-lg border border-white/10 bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 py-1 pl-2 pr-1">
              <span className="hidden max-w-32 items-center gap-1.5 truncate text-xs text-slate-300 lg:inline-flex">
                <UserCircle size={14} className="shrink-0 text-cyan-400" />
                <span className="truncate">{user.email}</span>
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-md p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={14} />
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
  );
}
