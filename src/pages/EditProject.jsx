// ✅ FINAL UPDATED EDIT PROJECT PAGE
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  Lightbulb,
  User,
  Link as LinkIcon,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Youtube,
} from "lucide-react";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        } else {
          toast.error("Project not found ❌");
          navigate("/projects");
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load project ❌");
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isEmpty = (val) => !val || !val.trim();
  const allowedYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const cleanFullGuide = (text) =>
    text.replace(/\r/g, "").replace(/(\n\s*\n){3,}/g, "\n\n").trim();
  const urlPattern = /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/\S*)?$/;

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      isEmpty(form.title) ||
      isEmpty(form.year) ||
      isEmpty(form.branch) ||
      isEmpty(form.description) ||
      isEmpty(form.glimpse)
    ) {
      toast.warn("Please fill all required fields properly ✏️", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    if (!allowedYears.includes(form.year)) {
      toast.warn("Please select a valid year 🎓", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    if (form.github && !urlPattern.test(form.github)) {
      toast.warn("Enter a valid GitHub URL", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    if (form.linkedin && !urlPattern.test(form.linkedin)) {
      toast.warn("Enter a valid LinkedIn URL", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    if (form.youtube && !urlPattern.test(form.youtube)) {
      toast.warn("Enter a valid YouTube URL", {
        icon: <AlertTriangle size={20} color="#f59e0b" />,
      });
      return;
    }

    try {
      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, {
        ...form,
        fullGuide: cleanFullGuide(form.fullGuide),
        updatedAt: Timestamp.now(),
        approved: false,
      });

      toast.success("Project updated! Pending approval ✅", {
        icon: <CheckCircle size={20} color="#10b981" />,
      });
      navigate("/projects");
    } catch (error) {
      console.error(error);
      toast.error("Update failed ❌", {
        icon: <AlertTriangle size={20} color="#ef4444" />,
      });
    }
  };

  if (loading || !form)
    return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-8 text-center">
          ✏️ Edit Your Project
        </h2>

        <form
          onSubmit={handleUpdate}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6 border border-gray-200 dark:border-gray-700"
        >
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Contributor Info
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name (optional)"
                className="input dark:bg-gray-700 dark:text-white"
              />
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Project Title"
                className="input dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="Year (e.g. 2nd Year)"
                className="input dark:bg-gray-700 dark:text-white"
                required
              />
              <input
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="Branch (e.g. CSE)"
                className="input dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" /> Project Overview
            </h3>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short 1-liner about the project"
              className="input mb-3 dark:bg-gray-700 dark:text-white"
              required
            />
            <textarea
              name="glimpse"
              value={form.glimpse}
              onChange={handleChange}
              placeholder="Short Glimpse of the Project"
              className="input dark:bg-gray-700 dark:text-white"
              rows={3}
              required
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" /> Full Guide (Optional)
            </h3>
            <textarea
              name="fullGuide"
              value={form.fullGuide}
              onChange={handleChange}
              placeholder="Detailed implementation steps, tools used, outcomes, etc."
              className="input dark:bg-gray-700 dark:text-white"
              rows={5}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-green-600" /> Additional Links (Optional)
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="GitHub Repository"
                className="input dark:bg-gray-700 dark:text-white"
              />
              <input
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn Profile"
                className="input dark:bg-gray-700 dark:text-white"
              />
              <input
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                placeholder="YouTube / Tutorial Link"
                className="input dark:bg-gray-700 dark:text-white"
              />
            </div>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Tags (e.g. AI, ML, Web)"
              className="input mt-4 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            ✏️ Update Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProject;
