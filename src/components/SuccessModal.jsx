import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SuccessModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 max-w-sm w-full rounded-xl shadow-xl p-6 text-center"
        >
          <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Project Submitted 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Your project has been successfully submitted to Project Mitra.
          </p>
          <p className="text-sm text-yellow-600 font-medium dark:text-yellow-400">
            Your project will be visible after admin approval ✅
          </p>

          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition"
            >
              Stay Here
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Go to Projects
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SuccessModal;
