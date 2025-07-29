import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

function GlimpseModal({ isOpen, onClose, project }) {
  const navigate = useNavigate();

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 sm:px-0"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-900 dark:text-white rounded-xl shadow-xl overflow-y-auto p-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-1">{project.title}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            🎓 {project.year} &nbsp; • &nbsp; 🛠 {project.branch}
          </p>

          {/* Glimpse Text */}
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {project.glimpse}
          </p>

          {/* Optional Links */}
          <div className="mt-5 space-y-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                🔗 GitHub Repository
              </a>
            )}
            {project.linkedin && (
              <a
                href={project.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                👤 Contributor’s LinkedIn
              </a>
            )}
          </div>

          {/* Full View Button */}
          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
          >
            View Full Project
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default GlimpseModal;
