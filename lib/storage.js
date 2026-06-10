"use client";

const ANALYSIS_KEY = "resume-iq-latest-analysis";

export function saveLatestAnalysis(analysis) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(analysis));
}

export function getLatestAnalysis() {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(ANALYSIS_KEY);
  return value ? JSON.parse(value) : null;
}
