import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import GlimpseModal from "../components/GlimpseModal";
import { db } from "../services/firebase";
import { query, where, collection, getDocs } from "firebase/firestore";
import { User, Filter } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CalendarIcon, BriefcaseIcon, CodeBracketIcon } from "@heroicons/react/24/outline";

function ProjectList() {
  const { user } = useAuth();
  const [projectsByYear, setProjectsByYear] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [yearFilter, setYearFilter] = useState("All");
  const [availableYears, setAvailableYears] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), where("approved", "==", true));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Group by year, default to "Others" if year is empty
        const grouped = {};
        const yearsSet = new Set();

        data.forEach((project) => {
          const year = project.year || "Others";
          yearsSet.add(year);
          if (!grouped[year]) grouped[year] = [];
          grouped[year].push(project);
        });

        // YEAR SORTING LOGIC
        const yearOrder = {
          "1st Year": 1,
          "2nd Year": 2,
          "3rd Year": 3,
          "4th Year": 4,
          Others: 5,
        };

        const sortedYears = Array.from(yearsSet).sort(
          (a, b) => (yearOrder[a] || 99) - (yearOrder[b] || 99)
        );

        const sortedGrouped = {};
        sortedYears.forEach((year) => {
          sortedGrouped[year] = grouped[year];
        });

        setProjectsByYear(sortedGrouped);
        setAvailableYears(["All", ...sortedYears]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const openModal = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setShowModal(false);
  };

  const getFilteredProjects = () => {
    if (yearFilter === "All") return projectsByYear;
    return { [yearFilter]: projectsByYear[yearFilter] || [] };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-white flex flex-col">
      <Navbar />

      <div className="pt-24 px-4 sm:px-6 md:px-10 w-full">
        {/* Hero & Filter */}
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 text-center">
            All Project Ideas Year-Wise
          </h2>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="appearance-none px-4 py-2 border border-blue-400 dark:border-violet-400 bg-white/80 dark:bg-gray-900/80 rounded-xl text-sm font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:shadow-md transition-all"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-20">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
        )}

        {/* No Data */}
        {!loading && Object.keys(getFilteredProjects()).length === 0 && (
          <div className="text-center my-16 text-gray-500 dark:text-gray-300">
            <p>No projects found for the selected criteria.</p>
          </div>
        )}

        {/* Year-wise Projects */}
        {Object.entries(getFilteredProjects()).map(([year, projects]) => (
          <div key={year} className="mb-16">
            <h3 className="flex items-center gap-2 text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6">
              <CalendarIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              {year}
            </h3>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-100/60 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:border-violet-400/60 dark:hover:border-violet-500/60 hover:shadow-[0_0_15px_3px_rgba(139,92,246,0.75)]"
                >
                  {/* Gradient Accent */}
                  <div className="h-1.5 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500" />

                  {/* Card Content */}
                  <div className="p-5 flex flex-col justify-between h-full gap-3.5">
                    <div>
                      <h3 className="font-extrabold text-xl tracking-normal text-blue-700 dark:text-blue-400">
                        {project.title}
                      </h3>

                      {project.name && (
                        <p className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 mt-1">
                          <User size={14} /> {project.name}
                        </p>
                      )}

                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mt-2">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100/70 dark:bg-blue-800/70 text-blue-700 dark:text-blue-300">
                          <CalendarIcon className="w-3 h-3" /> {project.year}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100/70 dark:bg-green-800/70 text-green-700 dark:text-green-300">
                          <BriefcaseIcon className="w-3 h-3" /> {project.branch}
                        </span>
                        {project.tags && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100/70 dark:bg-purple-800/70 text-purple-700 dark:text-purple-300">
                            <CodeBracketIcon className="w-3 h-3" /> {project.tags}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-5 justify-stretch">
                      <button
                        className="flex-1 text-sm font-medium tracking-wide bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1"
                        onClick={() => openModal(project)}
                      >
                        Glimpse
                      </button>

                      {user?.email === project.submittedBy && (
                        <button
                          className="text-sm font-medium tracking-wide bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 hover:shadow-lg transition-all duration-200 flex-1"
                          onClick={() => navigate(`/edit/${project.id}`)}
                        >
                          Edit
                        </button>
                      )}

                      <button
                        className="text-sm font-medium tracking-wide bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-200 flex-1"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        Full View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <GlimpseModal isOpen={showModal} onClose={closeModal} project={selectedProject} />
    </div>
  );
}

export default ProjectList;
