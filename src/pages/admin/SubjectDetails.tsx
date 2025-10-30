import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Plus,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import axiosInstance from "../../api/axios";
import type { Subject } from "../../types/subject";

interface Unit {
  _id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  subject?: string;
}

const SubjectDetails: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const res = await axiosInstance.get(`/subjects/${subjectId}`);
        setSubject(res.data.subject);
        setUnits(res.data.units || []);
      } catch (err) {
        console.error("Error fetching subject details:", err);
        setError("Failed to load subject details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [subjectId]);

  const handleDeleteUnit = async (unitId: string) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;
    try {
      await axiosInstance.delete(`/subjects/${subjectId}/units/${unitId}`);
      setUnits((prev) => prev.filter((unit) => unit._id !== unitId));
    } catch (error) {
      console.error("Error deleting unit:", error);
      alert("Failed to delete unit");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenData");
    window.location.href = "/admin/login";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Smart LMS</h1>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 flex flex-col p-4 space-y-2">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-40"
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar (mobile) */}
        <header className="md:hidden flex items-center justify-between bg-white shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {subject?.name || "Subject"}
          </h2>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Menu size={22} />
          </button>
        </header>

        <main className="flex-1 p-6 sm:p-8 space-y-8">
          {/* Back and Subject Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition mb-4"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-semibold text-gray-900">
                {subject?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                <span className="font-medium">Code:</span> {subject?.code}
              </p>
              <p className="text-gray-600 mt-2">{subject?.description}</p>
            </div>

            <button
              onClick={() =>
                navigate(`/admin/subjects/${subjectId}/units/create`)
              }
              className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              <Plus size={18} /> New Unit
            </button>
          </div>

          {/* Units Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Units
            </h2>

            {units.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit) => (
                  <div
                    key={unit._id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition relative"
                  >
                    <button
                      onClick={() => handleDeleteUnit(unit._id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                      title="Delete unit"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div
                      onClick={() =>
                        navigate(
                          `/admin/subjects/${subjectId}/units/${unit._id}`
                        )
                      }
                      className="cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {unit.title}
                      </h3>

                      {unit.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {unit.description}
                        </p>
                      )}

                      {unit.fileUrl && (
                        <a
                          href={unit.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <FileText size={16} />
                          View {unit.fileType?.toUpperCase() || "File"}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center col-span-full py-10 border border-dashed border-gray-300 rounded-lg bg-white">
                No units available for this subject yet.
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default SubjectDetails;
