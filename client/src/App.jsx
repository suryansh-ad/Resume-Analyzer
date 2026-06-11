import { useEffect, useRef, useState } from "react";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { UploadPanel } from "./components/UploadPanel";
import { AuthPanel } from "./components/AuthPanel";
import { api } from "./lib/api";
import { getLatestAnalysis, saveLatestAnalysis } from "./lib/storage";
import { AnalysisDashboard } from "./components/AnalysisDashboard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { AboutPage } from "./components/AboutPage";
import { Footer } from "./components/Footer";
import { supabase } from "./lib/supabase";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const AUTH_ERROR_PARAMS = ["error", "error_code", "error_description", "sb"];
const AUTH_SEARCH_PARAMS = ["code", "state", ...AUTH_ERROR_PARAMS];
const AUTH_HASH_PARAMS = [
  "access_token",
  "expires_at",
  "expires_in",
  "provider_refresh_token",
  "provider_token",
  "refresh_token",
  "token_type",
  "type",
  ...AUTH_ERROR_PARAMS,
];

function getCurrentPage() {
  return window.location.hash === "#about" ? "about" : "home";
}

function hasPasswordRecoveryMarker() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return searchParams.get("type") === "recovery" || hashParams.get("type") === "recovery";
}

function getAuthErrorMessage() {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const description = searchParams.get("error_description") || hashParams.get("error_description");

  if (!description) {
    return "";
  }

  if (/unable to exchange external code|google sign-in could not be completed/i.test(description)) {
    return "";
  }

  return description;
}

function showPasswordRecoveryForm() {
  setTimeout(() => {
    window.location.hash = "auth";
  }, 0);
}

function cleanPasswordRecoveryUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("type");
  url.hash = "auth";
  window.history.replaceState({}, document.title, url.toString());
}

function cleanAuthErrorUrl() {
  const url = new URL(window.location.href);
  AUTH_ERROR_PARAMS.forEach((key) => url.searchParams.delete(key));
  url.hash = "auth";
  window.history.replaceState({}, document.title, url.toString());
}

function cleanCompletedAuthUrl() {
  const url = new URL(window.location.href);
  let changed = false;

  AUTH_SEARCH_PARAMS.forEach((key) => {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  });

  const hashValue = url.hash.replace(/^#/, "");
  const hashParams = new URLSearchParams(hashValue);
  const hasAuthHashParams = AUTH_HASH_PARAMS.some((key) => hashParams.has(key));

  if (hasAuthHashParams) {
    AUTH_HASH_PARAMS.forEach((key) => hashParams.delete(key));
    url.hash = hashParams.toString();
    changed = true;
  }

  if (changed) {
    window.history.replaceState({}, document.title, url.toString());
  }
}

function logAuthTrace(source, session, extra = {}) {
  console.info("[fresherr-auth]", source, {
    event: extra.event,
    error: extra.error,
    hasSession: Boolean(session),
    userEmail: session?.user?.email ?? null,
    userId: session?.user?.id ?? null,
  });
}

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [record, setRecord] = useState(getLatestAnalysis());
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(getCurrentPage);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authError, setAuthError] = useState("");
  const userRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    function handleHashChange() {
      setPage(getCurrentPage());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title = page === "about" ? "About Fresherr" : "Fresherr";
  }, [page]);

  useEffect(() => {
    let active = true;

    function applySession(nextSession, source, extra = {}) {
      if (!active) {
        return;
      }

      logAuthTrace(source, nextSession, extra);
      const nextUser = nextSession?.user ?? null;

      if (!nextUser && userRef.current && extra.event !== "SIGNED_OUT") {
        console.info("[fresherr-auth] ignored null user update", { source, event: extra.event });
        if (extra.ready) {
          setAuthReady(true);
        }
        return;
      }

      userRef.current = nextUser;
      setUser(nextUser);

      if (extra.ready) {
        setAuthReady(true);
      }

      if (nextUser) {
        setAuthError("");
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      applySession(nextSession, "onAuthStateChange", {
        event,
        ready: event !== "INITIAL_SESSION" || Boolean(nextSession),
      });

      if (event === "PASSWORD_RECOVERY" || hasPasswordRecoveryMarker()) {
        setPasswordRecovery(true);
        showPasswordRecoveryForm();
        cleanPasswordRecoveryUrl();
      } else if (nextSession?.user) {
        setPasswordRecovery(false);
        cleanCompletedAuthUrl();
      } else if (event === "SIGNED_OUT") {
        setPasswordRecovery(false);
        setAuthError("");
      }
    });

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) {
        return;
      }

      const isPasswordRecovery = hasPasswordRecoveryMarker();
      const restoredSession = data?.session ?? null;
      const nextAuthError = restoredSession ? "" : sessionError?.message || getAuthErrorMessage();
      const hasAuthErrorParams = AUTH_ERROR_PARAMS.some((key) => {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        return searchParams.has(key) || hashParams.has(key);
      });

      applySession(restoredSession, "getSession", { error: sessionError?.message, ready: true });
      setPasswordRecovery(isPasswordRecovery);
      setAuthError(nextAuthError);

      if (isPasswordRecovery) {
        showPasswordRecoveryForm();
        cleanPasswordRecoveryUrl();
      } else if (restoredSession) {
        cleanCompletedAuthUrl();
      } else if (nextAuthError) {
        showPasswordRecoveryForm();
        cleanAuthErrorUrl();
      } else if (hasAuthErrorParams) {
        cleanAuthErrorUrl();
      }
    }).catch((sessionError) => {
      if (!active) {
        return;
      }

      console.info("[fresherr-auth] getSession failed", { error: sessionError?.message });
      userRef.current = null;
      setUser(null);
      setAuthError(sessionError?.message || "Unable to restore your sign-in session.");
      setAuthReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  function validateFile(selectedFile) {
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      return "Please upload a PDF or DOCX file.";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return "File size exceeds the 10MB limit.";
    }

    return "";
  }

  function handleFileSelect(selectedFile) {
    const validationError = validateFile(selectedFile);
    setError(validationError);

    if (validationError) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selectedFile);
    setProgress(0);
    setPreviewUrl(selectedFile.type === "application/pdf" ? URL.createObjectURL(selectedFile) : "");
  }

  function handleRemoveFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl("");
    setProgress(0);
    setError("");
  }

  async function handleAnalyze() {
    if (!user) {
      setError("Please sign in before analyzing a resume.");
      window.location.hash = "auth";
      return;
    }

    if (!file) {
      setError("Please choose a resume to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(15);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const uploadResponse = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total) {
            return;
          }

          const percent = Math.min(70, Math.round((event.loaded / event.total) * 70));
          setProgress(percent);
        },
      });

      setProgress(82);

      const analyzeResponse = await api.post("/resume/analyze", {
        extractedText: uploadResponse.data.extractedText,
        file: uploadResponse.data.file,
      });

      setProgress(100);
      setRecord(analyzeResponse.data);
      saveLatestAnalysis(analyzeResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to analyze this resume right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    console.info("[fresherr-auth] user set null", { source: "handleSignOut" });
    userRef.current = null;
    setUser(null);
    setPasswordRecovery(false);
  }

  return (
    <div className="min-h-screen font-sans bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_25%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]">
      <Navbar user={user} authReady={authReady} onSignOut={handleSignOut} />
      {page === "about" ? (
        <AboutPage />
      ) : (
        <>
          <Hero />

          {authReady ? (
            <AuthPanel
            user={user}
            passwordRecovery={passwordRecovery}
            authError={authError}
            onPasswordRecoveryComplete={() => setPasswordRecovery(false)}
            onSignOut={handleSignOut}
            />
          ) : null}
          <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <UploadPanel
              file={file}
              previewUrl={previewUrl}
              progress={progress}
              loading={loading}
              error={error}
              authReady={authReady}
              isAuthenticated={Boolean(user)}
              onFileSelect={handleFileSelect}
              onRemove={handleRemoveFile}
              onAnalyze={handleAnalyze}
            />
          </main>

          {loading ? (
            <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
              <LoadingSkeleton />
            </div>
          ) : (
            <AnalysisDashboard record={record} keyword={keyword} onKeywordChange={setKeyword} />
          )}
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;
