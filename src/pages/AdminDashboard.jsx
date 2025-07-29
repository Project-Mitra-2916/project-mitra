import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { CheckCircle, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.email !== "projectmitra2916@gmail.com") return;

    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setProjectLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "projects", id), { approved: true });
    toast.success("✅ Project Approved");
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, approved: true } : p))
    );
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this project?")) return;
    await deleteDoc(doc(db, "projects", id));
    toast.success("❌ Project Rejected & Deleted");
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this approved project?")) return;
    await deleteDoc(doc(db, "projects", id));
    toast.success("🗑️ Project Deleted");
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600 text-lg">
        Checking admin access...
      </div>
    );
  }

  if (user?.email !== "projectmitra2916@gmail.com") {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 text-center text-red-500 text-lg font-semibold">
        ⛔ Unauthorized Access
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6 text-center">
          🛠 Admin Dashboard
        </h2>

        {projectLoading ? (
          <div className="text-center text-blue-600 dark:text-blue-400">Loading projects...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md">
              <thead className="bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 text-sm">
                <tr>
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4">Year</th>
                  <th className="py-2 px-4">Branch</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-t border-gray-200 dark:border-gray-700 text-sm">
                    <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{project.title}</td>
                    <td className="py-3 px-4 text-center text-gray-800 dark:text-gray-200">{project.year}</td>
                    <td className="py-3 px-4 text-center text-gray-800 dark:text-gray-200">{project.branch}</td>
                    <td className="py-3 px-4 text-center">
                      {project.approved ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">Approved</span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      {!project.approved ? (
                        <>
                          <button
                            onClick={() => handleApprove(project.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(project.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(project.id)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs inline-flex items-center gap-1"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs inline-flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
