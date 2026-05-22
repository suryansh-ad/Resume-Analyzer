export function Navbar() {
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
        </div>
      </div>
    </nav>
  );
}
