"use client";

export default function Error({ error, reset }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Fresherr</p>
        <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {error?.message || "The page could not be loaded right now."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
