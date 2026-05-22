const ANALYSIS_KEY = "resume-iq-latest-analysis";

export function saveLatestAnalysis(analysis) {
  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(analysis));
}

export function getLatestAnalysis() {
  const value = localStorage.getItem(ANALYSIS_KEY);
  return value ? JSON.parse(value) : null;
}
