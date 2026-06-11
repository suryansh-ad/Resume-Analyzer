import { CheckCircle2, LoaderCircle, LockKeyhole, LogOut, Mail, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function getPasswordRecoveryRedirectUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set("type", "recovery");
  url.hash = "";
  return url.toString();
}

function getAuthRedirectUrl() {
  return window.location.origin;
}

export function AuthPanel({ user, passwordRecovery, authError, onPasswordRecoveryComplete, onSignOut }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const isSignUp = mode === "signup";
  const isReset = mode === "reset";

  useEffect(() => {
    setError(authError || "");
  }, [authError]);

  useEffect(() => {
    if (user) {
      setError("");
      setMessage("");
      setLoading(false);
    }
  }, [user]);

  function changeMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setError("");
    setPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    if (isReset) {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: getPasswordRecoveryRedirectUrl(),
      });

      if (resetError) {
        const rateLimited = /rate|limit|too many/i.test(resetError.message);
        const redirectBlocked = /redirect|not allowed|uri/i.test(resetError.message);
        const friendlyMessage = redirectBlocked
          ? "This reset link is not allowed by Supabase yet. Add this site URL to Supabase Auth redirect URLs, then try again."
          : resetError.message;
        setError(rateLimited ? "Too many reset attempts. Please wait a few minutes and try again." : friendlyMessage);
      } else {
        setMessage("If an account exists for that email, a password reset link has been sent.");
      }

      setLoading(false);
      return;
    }

    const credentials = {
      email: normalizedEmail,
      password,
    };

    const { data, error: authError } = isSignUp
      ? await supabase.auth.signUp(credentials)
      : await supabase.auth.signInWithPassword(credentials);

    if (authError) {
      const accountExists = /already|registered|exists/i.test(authError.message);
      const invalidCredentials = /invalid login credentials/i.test(authError.message);
      const friendlyMessage = invalidCredentials
        ? "Account doesn't exist or the password is incorrect. Please sign up or reset your password."
        : authError.message;

      setError(accountExists ? "Account already created. Please sign in or reset your password." : friendlyMessage);
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const accountAlreadyCreated =
        data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0;

      if (accountAlreadyCreated) {
        setError("Account already created. Please sign in or reset your password.");
      } else {
        setMessage("Check your email to confirm your account, then sign in.");
      }
    }

    setPassword("");
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setMessage("");
    setError("");

    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthRedirectUrl(),
        skipBrowserRedirect: true,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
      return;
    }

    if (data?.url) {
      window.location.assign(data.url);
      return;
    }

    setLoading(false);
  }

  async function handlePasswordUpdate(event) {
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
    setMessage("Password updated. You are signed in with your new password.");
    onPasswordRecoveryComplete?.();
    setLoading(false);
  }

  if (user && passwordRecovery) {
    return (
      <section id="auth" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <form
          onSubmit={handlePasswordUpdate}
          className="rounded-[2rem] border border-cyan-300/20 bg-slate-900/70 p-6 shadow-glass backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
              <LockKeyhole size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-cyan-200">Reset Password</p>
              <p className="mt-1 text-sm text-slate-300">Enter a new password for {user.email}.</p>
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

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}
            Update Password
          </button>
        </form>
      </section>
    );
  }

  if (user) {
    return (
      <section id="auth" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-cyan-300/20 bg-slate-900/70 p-6 shadow-glass backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
              <CheckCircle2 size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-cyan-200">Authenticated</p>
              <p className="mt-1 truncate text-sm text-slate-300">
                Signed in as <span className="text-white">{user.email}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="auth" className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-slate-900/70 p-6 shadow-glass backdrop-blur-xl md:grid-cols-[0.9fr_1.1fr] md:p-8">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
              <UserCircle size={26} />
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-cyan-300">Account Required</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Sign in to analyze resumes
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Your dashboard stays attached to your Supabase session, and resume analysis is available after authentication.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
            Use the email and password connected to your Fresherr account, or create a new one here.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
          <div className="grid grid-cols-2 rounded-2xl bg-slate-900 p-1 text-sm">
            <button
              type="button"
              onClick={() => changeMode("signin")}
              className={`rounded-xl px-4 py-3 font-medium transition ${
                mode === "signin" ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => changeMode("signup")}
              className={`rounded-xl px-4 py-3 font-medium transition ${
                isSignUp ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {!isReset ? (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-900">
                    G
                  </span>
                )}
                Continue with Google
              </button>

              <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                <span className="h-px flex-1 bg-white/10" />
                <span>Email</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>
            </>
          ) : null}

          <label className="mt-6 block text-sm font-medium text-slate-200" htmlFor="auth-email">
            Email
          </label>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
            <Mail size={18} className="text-slate-400" />
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="you@example.com"
            />
          </div>

          {!isReset ? (
            <>
              <label className="mt-5 block text-sm font-medium text-slate-200" htmlFor="auth-password">
                Password
              </label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="At least 6 characters"
                />
              </div>
            </>
          ) : null}

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="mt-4 text-sm text-cyan-200">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}
            {isReset ? "Send Reset Link" : isSignUp ? "Create Account" : "Sign In"}
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            {!isReset ? (
              <button
                type="button"
                onClick={() => changeMode("reset")}
                className="text-cyan-200 transition hover:text-white"
              >
                Forgot password?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => changeMode("signin")}
                className="text-cyan-200 transition hover:text-white"
              >
                Back to sign in
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
