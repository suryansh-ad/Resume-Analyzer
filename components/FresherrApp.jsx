"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AuthPanel } from "./AuthPanel";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Navbar } from "./Navbar";
import { UploadPanel } from "./UploadPanel";
import { api } from "../lib/api";
import { getLatestAnalysis, saveLatestAnalysis } from "../lib/storage";
import { supabase } from "../lib/supabase/client";

const AnalysisDashboard = dynamic(
  () => import("./AnalysisDashboard").then((module) => module.AnalysisDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <LoadingSkeleton />
      </div>
    ),
  }
);

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function hasPasswordRecoveryMarker() {
  if (typeof window === "undefined") {
    return false;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return searchParams.get("type") === "recovery" || hashParams.get("type") === "recovery";
}

function getAuthErrorMessage() {
  if (typeof window === "undefined") {
    return "";
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const description = searchParams.get("error_description") || hashParams.get("error_description");

  if (!description) {
    return "";
  }

  if (/unable to exchange external code/i.test(description)) {
    return "Google sign-in could not be completed. Check the Google OAuth provider setup in Supabase, then try again.";
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
  url.searchParams.delete("error");
  url.searchParams.delete("error_code");
  url.searchParams.delete("error_description");
  url.searchParams.delete("sb");
  url.hash = "auth";
  window.history.replaceState({}, document.title, url.toString());
}

export function FresherrApp() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [record, setRecord] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setRecord(getLatestAnalysis());
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }

      const isPasswordRecovery = hasPasswordRecoveryMarker();
      const nextAuthError = getAuthErrorMessage();
      setSession(data.session);
      setPasswordRecovery(isPasswordRecovery);
      setAuthError(nextAuthError);
      setAuthReady(true);

      if (isPasswordRecovery) {
        showPasswordRecoveryForm();
        cleanPasswordRecoveryUrl();
      } else if (nextAuthError) {
        showPasswordRecoveryForm();
        cleanAuthErrorUrl();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);

      if (event === "PASSWORD_RECOVERY" || hasPasswordRecoveryMarker()) {
        setPasswordRecovery(true);
        showPasswordRecoveryForm();
        cleanPasswordRecoveryUrl();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    if (!session?.user) {
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
    setSession(null);
    setPasswordRecovery(false);
  }

  const user = session?.user ?? null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_25%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]">
      <Navbar user={user} onSignOut={handleSignOut} />
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

      <Footer />
    </div>
  );
}
