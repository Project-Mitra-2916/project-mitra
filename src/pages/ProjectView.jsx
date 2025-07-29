import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import Navbar from "../components/Navbar";
import {
  ExternalLink,
  Github as GithubIcon,
  Linkedin,
  UserCircle,
  Lock,
  Youtube,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";

function ProjectView() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject(docSnap.data());
        } else {
          alert("Project not found ❌");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        alert("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const formatGuide = (text) => {
    if (!text) return "";
    return text.replace(/\n{3,}/g, "\n\n");
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-blue-600 dark:text-blue-400 text-lg">
        Loading...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center mt-20 text-red-500 dark:text-red-400">
        Project not found
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen text-gray-800 dark:text-gray-100 pt-24">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-400 mb-2">
          {project.title}
        </h1>

        <div className="mb-4 flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300 items-center">
          {project.name && (
            <span className="flex items-center gap-1">
              <UserCircle size={16} className="text-blue-600 dark:text-blue-400" />
              Submitted By: {project.name}
            </span>
          )}
          <span>🎓 {project.year}</span>
          <span>🛠 {project.branch}</span>
        </div>

        {project.tags && (
          <div className="mb-4">
            <span className="font-semibold text-blue-700 dark:text-blue-400">Tags:</span>{" "}
            <span className="text-gray-600 dark:text-gray-300">{project.tags}</span>
          </div>
        )}

        {project.description && (
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold tracking-wide text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-2">
              📄 Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300 border-l-4 border-blue-400 pl-4 italic">
              {project.description}
            </p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold tracking-wider text-blue-700 dark:text-blue-400">
            🔍 Glimpse
          </h3>
          <p className="text-gray-800 dark:text-gray-300 whitespace-pre-line">
            {formatGuide(project.glimpse)}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-blue-700 dark:text-blue-400">
            📘 Full Guide
          </h2>

          {user ? (
            <p className="text-gray-800 dark:text-gray-300 whitespace-pre-line">
              {project.fullGuide?.trim()
                ? formatGuide(project.fullGuide)
                : "This project currently does not include a full guide."}
            </p>
          ) : (
            <div className="relative bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg p-4 overflow-hidden min-h-[150px]">
              <div className="blur-sm select-none text-gray-500 dark:text-gray-400 whitespace-pre-line max-h-60 overflow-y-hidden">
                {project.fullGuide?.trim()
                  ? formatGuide(project.fullGuide)
                  : "This project currently does not include a full guide."}
              </div>

              <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/70 flex flex-col items-center justify-center text-center px-4">
                <Lock size={32} className="text-blue-600 dark:text-blue-400 mb-2" />
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Login to unlock full guide
                </p>
                <a
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Login Now
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              <GithubIcon size={16} /> GitHub
            </a>
          )}
          {project.linkedin && (
            <a
              href={project.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          )}
          {project.youtube && (
            <a
              href={project.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              <Youtube size={16} /> YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectView;
