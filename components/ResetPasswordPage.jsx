"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { supabase } from "../lib/supabase/client";

export function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(() => {
      if (active) {
        setReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setNewPassword("");
    setMessage("Password updated. You can continue to Fresherr.");
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_25%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))] px-4 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-[2rem] border border-cyan-300/20 bg-slate-900/70 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
            <LockKeyhole size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-cyan-200">Reset Password</p>
            <h1 className="mt-1 text-2xl font-semibold">Create a new password</h1>
          </div>
        </div>

        <label className="mt-6 block text-sm font-medium text-slate-200" htmlFor="new-password">
          New Password
        </label>
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
          <LockKeyhole size={18} className="text-slate-400" />
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="At least 6 characters"
          />
        </div>

        {!ready ? <p className="mt-4 text-sm text-slate-300">Preparing your secure reset session...</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}

        <button
          type="submit"
          disabled={loading || !ready}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}
          Update Password
        </button>

        <Link href="/auth" className="mt-5 inline-flex w-full justify-center text-sm text-cyan-200 transition hover:text-white">
          Back to sign in
        </Link>
      </form>
    </main>
  );
}
