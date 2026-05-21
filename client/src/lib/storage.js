const THEME_KEY = "resume-iq-theme";
const ANALYSIS_KEY = "resume-iq-latest-analysis";

export function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

export function setStoredTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function saveLatestAnalysis(analysis) {
  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(analysis));
}

export function getLatestAnalysis() {
  const value = localStorage.getItem(ANALYSIS_KEY);
  return value ? JSON.parse(value) : null;
}

