import { LogOut, UserCircle } from "lucide-react";

export function Navbar({ user, onSignOut }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#/" className="flex items-center gap-3">
          <img
            src="/frr-logo.jpeg"
            alt="FRR logo"
            className="h-11 w-11 rounded-2xl object-cover shadow-lg shadow-cyan-500/20"
          />
          <div>
            <p className="text-lg font-semibold tracking-tight">Fresherr</p>
          </div>
        </a>

        <div className="flex items-center gap-5">
          <a href="#/" className="text-sm text-slate-300 transition hover:text-white">
            Home
          </a>
          <a href="#about" className="text-sm text-slate-300 transition hover:text-white">
            About
          </a>
          <a href="#analyzer" className="hidden text-sm text-slate-300 transition hover:text-white sm:block">
            Analyzer
          </a>
          {user ? (
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-2 pr-1">
              <span className="hidden max-w-44 items-center gap-2 truncate text-xs text-slate-300 md:inline-flex">
                <UserCircle size={16} className="shrink-0" />
                <span className="truncate">{user.email}</span>
              </span>
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <a href="#auth" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5">
              Sign In
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
