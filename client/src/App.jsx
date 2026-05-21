import { useEffect, useState } from "react";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { UploadPanel } from "./components/UploadPanel";
import { api } from "./lib/api";
import { getLatestAnalysis, getStoredTheme, saveLatestAnalysis, setStoredTheme } from "./lib/storage";
import { AnalysisDashboard } from "./components/AnalysisDashboard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function App() {
  const [darkMode, setDarkMode] = useState(getStoredTheme() === "dark");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [record, setRecord] = useState(getLatestAnalysis());
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    setStoredTheme(darkMode ? "dark" : "light");
  }, [darkMode]);

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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.4),transparent)] dark:bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_25%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]">
      <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode((value) => !value)} />
      <Hero />

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <UploadPanel
          file={file}
          previewUrl={previewUrl}
          progress={progress}
          loading={loading}
          error={error}
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
    </div>
  );
}

export default App;
