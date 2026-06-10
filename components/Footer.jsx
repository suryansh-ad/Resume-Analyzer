import { siteConfig } from "../lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-base leading-8 text-cyan-300 sm:px-6 lg:px-8">
        <p>&copy; 2026 Fresherr | Building India's Fresher Opportunity Platform</p>
        <p>
          <a target="_blank" rel="noreferrer" href={siteConfig.social.instagram}>
            Instagram @fresherr.in
          </a>
        </p>
        <p>
          <a target="_blank" rel="noreferrer" href={siteConfig.social.linkedin}>
            Linkedin @fresherr
          </a>
        </p>
      </div>
    </footer>
  );
}
