"use client";

import jsPDF from "jspdf";

export function downloadAnalysisPdf(record) {
  const doc = new jsPDF();
  const lines = [
    "ResumeIQ Analysis Report",
    "",
    `Candidate: ${record.analysis.name || "Unknown"}`,
    `Resume score: ${record.analysis.resumeScore}/100`,
    `ATS score: ${record.analysis.atsScore}/100`,
    "",
    "Summary",
    record.analysis.summary || "No summary available.",
    "",
    "Top Skills",
    (record.analysis.skills || []).join(", ") || "None",
    "",
    "Suggested Improvements",
    ...(record.analysis.suggestions || []).map((item) => `- ${item}`),
  ];

  let y = 20;
  lines.forEach((line) => {
    const split = doc.splitTextToSize(line, 170);
    split.forEach(sLine => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(sLine, 20, y);
      y += 7;
    });
  });

  doc.save(`${(record.analysis.name || "resume").replace(/\s+/g, "-").toLowerCase()}-analysis.pdf`);
}

export function downloadJdAnalysisPdf(record) {
  const doc = new jsPDF();
  const lines = [
    "ResumeIQ Match Analysis Report",
    "====================================",
    "",
    `Candidate: ${record.analysis.name || "Unknown"}`,
    `Overall Match Score: ${record.analysis.overallMatchScore}/100`,
    `ATS Compatibility Score: ${record.analysis.atsCompatibilityScore}/100`,
    `Semantic Similarity Score: ${record.analysis.semanticSimilarityScore}/100`,
    "",
    "AI Overall Summary",
    record.analysis.overallSummary || "No summary available.",
    "",
    "Experience Match",
    record.analysis.experienceMatch || "No experience analysis available.",
    "",
    "Matching Skills",
    (record.analysis.matchingSkills || []).join(", ") || "None matched.",
    "",
    "Missing Skills",
    (record.analysis.missingSkills || []).join(", ") || "None missing.",
    "",
    "Missing Keywords (Priority)",
    ...(record.analysis.missingKeywords || []).map(
      (item) => `- ${item.keyword} (${item.importance} Importance): ${item.reason}`
    ),
    "",
    "Strengths",
    ...(record.analysis.strengths || []).map((item) => `- ${item}`),
    "",
    "Weaknesses",
    ...(record.analysis.weaknesses || []).map((item) => `- ${item}`),
    "",
    "Suggestions to Improve",
    ...(record.analysis.suggestions || []).map((item) => `- ${item}`),
    "",
    "ATS Bullet Point Rewrites",
    ...(record.analysis.bulletPointRewrites || []).flatMap((item) => [
      `Original: "${item.original}"`,
      `ATS-Optimized: "${item.improved}"`,
      ""
    ]),
    "",
    "Project Recommendations",
    ...(record.analysis.projectRecommendations || []).map((item) => `- ${item}`),
    "",
    "Interview Preparation Topics",
    ...(record.analysis.interviewPrepTopics || []).map((item) => `- ${item}`),
  ];

  let y = 20;
  lines.forEach((line) => {
    const split = doc.splitTextToSize(line, 170);
    split.forEach(sLine => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(sLine, 20, y);
      y += 7;
    });
  });

  doc.save(`${(record.analysis.name || "resume").replace(/\s+/g, "-").toLowerCase()}-jd-analysis.pdf`);
}
