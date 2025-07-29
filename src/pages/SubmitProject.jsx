import { useState } from "react";
import Navbar from "../components/Navbar";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  Lightbulb,
  User,
  Link as LinkIcon,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import SuccessModal from "../components/SuccessModal";
import { useAuth } from "../context/AuthContext";
import { ArrowPathIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

function SubmitProject() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    title: "",
    year: "",
    branch: "",
    glimpse: "",
    fullGuide: "",
    description: "",
    github: "",
    linkedin: "",
    youtube: "",
    tags: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "Please fill this field" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const cleanFullGuide = (text) => {
    return text
      .replace(/\r/g, "")
      .replace(/(\n\s*\n){3,}/g, "\n\n")
      .replace(/[ \t]{3,}/g, " ")
      .trim();
  };

  const isEmptyOrWhitespace = (value) => !value || !value.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      isEmptyOrWhitespace(form.title) ||
      isEmptyOrWhitespace(form.year) ||
      isEmptyOrWhitespace(form.branch) ||
      isEmptyOrWhitespace(form.description) ||
      isEmptyOrWhitespace(form.glimpse)
    ) {
      toast.warn("Please fill in all required fields", {
        icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      });
      return;
    }

    if (Object.values(errors).some((msg) => msg)) {
      toast.warn("Please fix the highlighted fields", {
        icon: <ExclamationTriangleIcon className="w-5 h-5" />,
      });
      return;
    }

    setSubmitting(true);
    try {
      const cleanedGuide = cleanFullGuide(form.fullGuide);

      const q = query(
        collection(db, "projects"),
        where("title", "==", form.title.trim()),
        where("year", "==", form.year),
        where("branch", "==", form.branch)
      );

      const existing = await getDocs(q);
      if (!existing.empty) {
        toast.warn("A similar project already exists", {
          icon: "⚠️",
        });
        return;
      }

      const docRef = await addDoc(collection(db, "projects"), {
        ...form,
        fullGuide: cleanedGuide,
        approved: false,
        createdAt: Timestamp.now(),
        submittedBy: user?.email,
        userId: user?.uid,
      });

      setShowSuccessModal(true);
      setForm({
        name: "",
        title: "",
        year: "",
        branch: "",
        glimpse: "",
        fullGuide: "",
        description: "",
        github: "",
        linkedin: "",
        youtube: "",
        tags: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const renderError = (field) =>
    errors[field] ? (
      <p className="text-pink-500 text-xs font-medium mt-1 inline-flex items-center gap-1">
        <ExclamationTriangleIcon className="w-4 h-4" /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen text-gray-800 dark:text-white">
      <Navbar />

      {/* Main Container */}
      <Transition
        appear
        show={true}
        enter="transition ease-out duration-500"
        enterFrom="opacity-0 translate-y-6"
        enterTo="opacity-100 translate-y-0"
      >
        <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-8">
            🚀 Submit Your Project
          </h2>

          <div className="bg-white/80 dark:bg-gray-800/90 p-8 rounded-xl shadow-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contributor Info */}
              <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 rounded-xl border-l-4 border-blue-400 dark:border-blue-500">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  Contributor Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your Name (optional)"
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Project Title"
                        className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        required
                        minLength={3}
                      />
                    </div>
                    {renderError("title")}
                  </div>
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <select
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none transition"
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296-.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                      placeholder="Branch (e.g. CSE, ECE)"
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                      required
                      minLength={2}
                    />
                  </div>
                </div>
                {renderError("branch")}
              </div>

              {/* Project Overview */}
              <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 rounded-xl border-l-4 border-yellow-400 dark:border-yellow-300">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500 dark:text-yellow-300" />
                  Project Overview
                </h3>
                <div>
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute left-3 top-4 text-gray-400 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <input
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Short 1-liner about the project"
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                      required
                      minLength={5}
                    />
                  </div>
                  {renderError("description")}
                  <div className="mt-4 relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute left-3 top-4 text-gray-400 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5h10M11 12h10M11 19h10"
                      />
                    </svg>
                    <textarea
                      name="glimpse"
                      value={form.glimpse}
                      onChange={handleChange}
                      placeholder="Short Glimpse of the Project"
                      className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                      rows={3}
                      required
                      minLength={10}
                    />
                  </div>
                  {renderError("glimpse")}
                </div>
              </div>

              {/* Full Guide */}
              <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 rounded-xl border-l-4 border-purple-400 dark:border-purple-500">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-500 dark:text-purple-300" />
                  Full Guide (Optional)
                </h3>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 absolute left-3 top-4 text-gray-400 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <textarea
                    name="fullGuide"
                    value={form.fullGuide}
                    onChange={handleChange}
                    placeholder="Detailed implementation steps, tools used, outcomes, etc."
                    className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    rows={5}
                  />
                </div>
              </div>

              {/* Additional Links */}
              <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 rounded-xl border-l-4 border-green-400 dark:border-green-500">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  <LinkIcon className="w-5 h-5 text-green-500 dark:text-green-300" />
                  Additional Links (Optional)
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      name="github"
                      value={form.github}
                      onChange={handleChange}
                      placeholder="GitHub Repository"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <input
                      name="linkedin"
                      value={form.linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn Profile"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <input
                      name="youtube"
                      value={form.youtube}
                      onChange={handleChange}
                      placeholder="YouTube / Tutorial Link"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="Tags (e.g. AI, ML, Web)"
                      className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-violet-700 shadow-lg hover:scale-[1.01] active:scale-[1.01] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:translate-y-0"
              >
                {submitting ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckIcon className="h-5 w-5" />
                )}
                Submit Project
              </button>
            </form>
          </div>
        </div>
      </Transition>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}

export default SubmitProject;
