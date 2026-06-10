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
    doc.text(split, 20, y);
    y += split.length * 7;
  });

  doc.save(`${(record.analysis.name || "resume").replace(/\s+/g, "-").toLowerCase()}-analysis.pdf`);
}
