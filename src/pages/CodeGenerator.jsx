import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";
import { Zap, ClipboardCopy } from "lucide-react";
import { generateCodeFromPrompt } from "../services/openrouterService";
import hljs from "highlight.js/lib/core";
// Minimal manual registers (for bundle size)
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import { toast } from "react-toastify";
import "highlight.js/styles/atom-one-dark.css";

// Register some popular languages, but "auto-detect" will work for others
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("html", html);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);

const CodeGenerator = () => {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState("Python");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState({ explanation: "", code: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const languages = [
    "Ada", "Assembly", "Bash", "C", "C#", "C++", "COBOL", "CSS", "Dart",
    "Elixir", "Erlang", "Fortran", "Gherkin", "Go", "GraphQL", "Groovy",
    "Haskell", "HTML", "Java", "JavaScript", "JSON", "Julia", "Kotlin",
    "LaTeX", "Lisp", "Lua", "MATLAB", "Objective-C", "Pascal", "Perl", "PHP",
    "PowerShell", "Prolog", "Python", "R", "Ruby", "Rust", "Scala", "Shell",
    "Solidity", "SQL", "Swift", "TOML", "TypeScript", "VB.NET", "Verilog",
    "VHDL", "XML", "YAML", "Zig"
  ];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  // Auto-highlight all code blocks after render (auto-detect language feature of highlight.js)
  useEffect(() => {
    if (output.code) {
      hljs.highlightAll(); // This will highlight all code blocks on the page, auto-detecting the language
    }
  }, [output.code]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput({ explanation: "", code: "" });

    try {
      const fullPrompt = `Generate ${language} code for: ${prompt}`;
      const result = await generateCodeFromPrompt(fullPrompt);

      if (typeof result === "string" && result.startsWith("<!DOCTYPE")) {
        throw new Error("Received HTML instead of JSON. Is your server running correctly?");
      }

      setOutput({
        explanation: result.explanation || "No explanation provided.",
        code: result.code || "No code returned."
      });
    } catch (err) {
      console.error("Code generation failed:", err);
      setOutput({
        explanation: "❌ Error generating code. Check if the backend server is running.",
        code: ""
      });
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output.code);
    toast.success("Code copied to clipboard!", { position: "top-right" });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-12 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl p-8 border border-transparent dark:border-white/10 hover:shadow-lg transition-all">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
            🚀 AI Code Generator
          </h1>

          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer"
              aria-label="Select programming language"
            >
              {languages.map((lang, index) => (
                <option key={index} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Your Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="e.g., Create a responsive navbar with Tailwind CSS"
              aria-label="Describe the code you want to generate"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Describe the code you want to generate in detail.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 mt-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-[0.98]"
            aria-live="polite"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Generate Code
              </>
            )}
          </button>
        </div>

        {(output.explanation || output.code) && (
          <div className="w-full max-w-3xl mt-8 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl p-7 border border-transparent dark:border-white/10 hover:shadow-lg transition-all">
            {output.explanation && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <span role="img" aria-label="Book">📘</span> Explanation
                </h2>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {output.explanation}
                </p>
              </div>
            )}

            {output.code && (
              <div className="mb-0">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <span role="img" aria-label="Laptop">💻</span> Code
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="text-sm px-3 py-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-95"
                    aria-label="Copy code to clipboard"
                  >
                    <ClipboardCopy className="h-4 w-4" /> Copy
                  </button>
                </div>
                <div className="relative">
                  <pre className="m-0 p-0 rounded-xl overflow-hidden">
                    {/* 
                      The "hljs" class on <code> makes highlight.js always apply styles.
                      Class "language-..." is optional, used if you want manual control. 
                    */}
                    <code className="hljs" // <- just "hljs", let highlight.js detect!
                      style={{
                        display: "block",
                        overflow: "auto",
                        maxHeight: "32rem",
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Monaco', monospace",
                        fontSize: "0.9375rem",
                        lineHeight: "1.5",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {output.code}
                    </code>
                  </pre>
                  <style>{`
                    .hljs {
                      background: #181c23 !important;
                      color: #e6efff !important;
                      border-radius: 0.75rem;
                      padding: 1.2rem 1rem;
                      font-size: 0.97em;
                      box-shadow: 0 4px 30px rgba(0,0,0,0.13);
                      border: 1px solid rgba(255,255,255,0.07);
                    }
                  `}</style>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CodeGenerator;
