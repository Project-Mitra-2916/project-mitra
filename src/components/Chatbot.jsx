import { useState, useRef, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

// Check if input message relates to projects for shortcut
function isProjectQuery(msg) {
  const keywords = [
    "project", "guide", "tutorial", "idea", "code",
    "make", "build", "create", "how to", "sample", "example"
  ];
  const lower = msg.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

// Extract year info with improved regex patterns
function extractYearFromQuery(query) {
  const lower = query.toLowerCase();
  const yearMap = {
    "(1|first|1st|year\\s*1|one|class\\s*1|1st\\s*year)": "1",
    "(2|second|2nd|year\\s*2|two|class\\s*2|2nd\\s*year)": "2",
    "(3|third|3rd|year\\s*3|three|class\\s*3|3rd\\s*year)": "3",
    "(4|fourth|4th|year\\s*4|four|class\\s*4|4th\\s*year)": "4",
  };
  for (const pattern in yearMap) {
    const regex = new RegExp(`\\b${pattern}\\b`, "i");
    if (regex.test(lower)) return yearMap[pattern];
  }
  return null;
}

// Extended tags extraction including tech and common subjects
function extractTagsFromQuery(query) {
  const knownTags = [
    "physics", "chemistry", "math", "biology", "computer", "electrical", "mechanical",
    "python", "ai", "machine learning", "web", "blockchain", "robotics", "data science",
    "electronics", "java", "c++", "php", "html", "css", "javascript", "react", "vue", "tailwindcss", "tailwind",
    "springboot", "spring"
  ];
  const lower = query.toLowerCase();
  return knownTags.filter(tag => lower.includes(tag));
}

const normalizeString = (str) => str?.trim().toLowerCase() || "";

function shuffleArray(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const generateProjectLink = (docId) => `/projects/${docId}`;

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Main Firestore search with combined year & tag filtering + debug logs
  const findProjectsInFirestore = async (userQuery) => {
    const yearFilter = extractYearFromQuery(userQuery);    // e.g. "2"
    const tagsInQuery = extractTagsFromQuery(userQuery);    // e.g. ["chemistry","python"]
    const queryWordsRaw = userQuery.toLowerCase().split(/\s+/).map(s => s.trim()).filter(Boolean);
    const genericWords = ["project", "projects", "idea", "ideas", "mini", "give", "me", "some", "for", "in", "the", "my", "guide", "tutorial"];
    const queryWords = queryWordsRaw.filter(qw => !genericWords.includes(qw));

    let projectsQuery = collection(db, "projects");
    const snapshot = await getDocs(projectsQuery);
    const matches = [];

    snapshot.forEach(docSnap => {
      const proj = docSnap.data();
      const docId = docSnap.id;

      const projYear = (proj.year || "").toLowerCase();
      let tagsArray = [];
      if (Array.isArray(proj.tags)) {
        tagsArray = proj.tags.map(t => normalizeString(t));
      } else if (typeof proj.tags === "string") {
        tagsArray = proj.tags.split(/[, ]+/).map(t => normalizeString(t));
      }
      const title = normalizeString(proj.title || "");
      const combinedTagsTitle = [...tagsArray, title];

      // 1. Year + tags in query: must match both
      if (yearFilter && tagsInQuery.length > 0) {
        if (!projYear.includes(yearFilter)) return;
        const tagMatch = tagsInQuery.some(qTag =>
          tagsArray.some(projTag => projTag.includes(qTag) || qTag.includes(projTag)) ||
          title.includes(qTag)
        );
        if (!tagMatch) return;
      }
      // 2. Only year present: match year only (don’t do further title/tag match)
      else if (yearFilter && tagsInQuery.length === 0) {
        if (!projYear.includes(yearFilter)) return;
      }
      // 3. Only tags present: match tags only (no year filter)
      else if (!yearFilter && tagsInQuery.length > 0) {
        const tagMatch = tagsInQuery.some(qTag => 
          tagsArray.some(projTag => projTag.includes(qTag) || qTag.includes(projTag)) ||
          title.includes(qTag)
        );
        if (!tagMatch) return;
      }
      // 4. No direct filter: use fuzzy queryWords as a fallback (very broad)
      else if (!yearFilter && !tagsInQuery.length && queryWords.length > 0) {
        const relevantMatch = queryWords.some(qw =>
          combinedTagsTitle.some(item => item.includes(qw) || qw.includes(item))
        );
        if (!relevantMatch) return;
      }
      // If user input has no context at all, skip
      else {
        return;
      }
      // All filters passed, add project!
      matches.push({
        title: proj.title || "Untitled Project",
        link: generateProjectLink(docId),
      });
    });

    console.log(`[Debug]: Total matched projects found: ${matches.length}`);
    return shuffleArray(matches).slice(0, 5);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      let botMsg = null;

      if (isProjectQuery(input)) {
        const projects = await findProjectsInFirestore(input);

        console.log(`[Debug]: Projects returned to UI: ${projects.length}`);

        if (projects.length > 0) {
          botMsg = {
            role: "bot",
            content: (
              <div>
                <p className="font-semibold mb-2">Here are some projects from our site:</p>
                <ul className="space-y-2 ml-4">
                  {projects.map((proj, i) => (
                    <li key={i}>
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md px-3 py-1 shadow-md hover:from-blue-600 hover:to-indigo-700 transition"
                      >
                        {proj.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          };
          setMessages(prev => [...prev, botMsg]);
        }
      }

      if (!botMsg) {
        // fallback to backend online chatbot search
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chatbot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });

        const data = await res.json();

        if (Array.isArray(data.ideas) && data.ideas.length > 0) {
          const ideasToShow = data.ideas.slice(0, 5);
          botMsg = {
            role: "bot",
            content: (
              <div>
                <p className="font-semibold mb-2">Here are some project ideas you might find helpful:</p>
                <ul className="list-decimal list-inside space-y-1 ml-4">
                  {ideasToShow.map((idea, i) => (
                    <li key={i}>{idea}</li>
                  ))}
                </ul>
              </div>
            ),
          };
          setMessages(prev => [...prev, botMsg]);
        } else {
          const replyText = data.reply || "Sorry, I couldn't find anything for that. Please try again.";
          botMsg = { role: "bot", content: replyText };
          setMessages(prev => [...prev, botMsg]);
        }
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "bot", content: "⚠️ Something went wrong. Please try again later." },
      ]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 z-50 font-sans w-full max-w-[400px] sm:right-6 sm:bottom-5 sm:max-w-md">
      {/* Toggle Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:scale-105 hover:shadow-2xl transition-all duration-200 focus:outline-none border-2 border-white ${isOpen ? "ring-2 ring-indigo-400" : ""}`}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        <span className="text-xl">💬</span>
        <span className="font-medium">{isOpen ? "Close" : "Chat"}</span>
      </button>

      {/* Chatbox */}
      <div
        className={`transition-all duration-300 ${isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"} origin-bottom-right`}
      >
        {isOpen && (
          <div className="relative w-full max-w-[95vw] sm:max-w-md mt-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl flex flex-col h-[70vh] sm:h-[32rem]">
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 bg-gradient-to-r from-indigo-600 to-sky-600 rounded-t-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="font-bold text-lg text-white drop-shadow">MitraBot</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white opacity-80 hover:opacity-100 text-xl px-2 focus:outline-none"
                aria-label="Close chat"
              >
                {/* You can add an "X" or icon here if you want */}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50 dark:bg-gray-800 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center mt-16 text-gray-400 select-none">
                  <span className="text-5xl mb-2">👋</span>
                  <span className="text-base font-medium">How can I help you today?</span>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "user" ? (
                    <div className="max-w-[70%] px-4 py-2 rounded-lg shadow bg-gradient-to-r from-blue-500 to-sky-400 text-white rounded-br-3xl whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="max-w-[75%] flex items-start gap-2">
                      <span className="flex-shrink-0 text-2xl bg-gradient-to-tr from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 border border-indigo-200 dark:border-indigo-700 rounded-full h-9 w-9 flex items-center justify-center shadow">
                        🤖
                      </span>
                      <div className="bg-gradient-to-tr from-indigo-50 to-sky-50 dark:from-indigo-800 dark:to-sky-900 border-l-4 border-indigo-400 dark:border-sky-500 px-4 py-2 rounded-lg shadow rounded-bl-3xl text-gray-900 dark:text-white w-full whitespace-pre-wrap break-words">
                        {msg.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
              {loading && (
                <div className="flex justify-start items-center pl-2 text-sky-700 dark:text-sky-300 animate-pulse">
                  <span className="text-lg">Thinking</span>
                  <span className="animate-bounce ml-1">...</span>
                </div>
              )}
            </div>

            <form
              className="flex items-center gap-2 px-4 py-3 border-t dark:border-gray-700 bg-white dark:bg-gray-900"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <textarea
                rows={1}
                className="flex-1 resize-none border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Type your message"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-5 py-2 rounded-full shadow hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  "Send"
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.2);
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
