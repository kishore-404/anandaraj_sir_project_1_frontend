import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Plus, Trash2 } from "lucide-react";
import Modal from "../../components/Modals";
import axiosInstance from "../../api/axios";
import type { Subject } from "../../types/subject";
import AdminSidebar from "../../components/Sidebar"; // ✅ Import the sidebar

const AdminDashboard: React.FC = () => {
  const [adminName, setAdminName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [subject, setSubject] = useState<Subject>({
    name: "",
    code: "",
    description: "",
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("tokenData");
    if (userData) {
      const parsed = JSON.parse(userData);
      setAdminName(parsed.name);
    } else {
      setAdminName("Admin");
    }
  }, []);

  const fetchSubjects = async (): Promise<void> => {
    try {
      const res = await axiosInstance.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Failed to fetch subjects", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenData");
    window.location.href = "/admin/login";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSubject({ ...subject, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axiosInstance.post("/subjects/create", subject);
      setMessage(res.data.message);
      setSubject({ name: "", code: "", description: "" });
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to create subject");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      await axiosInstance.delete(`/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Error deleting subject");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <AdminSidebar
        adminName={adminName}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar (mobile) */}
        <header className="md:hidden flex items-center justify-between bg-white shadow p-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Welcome, {adminName}
          </h2>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {adminName || "Admin"} 👋</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              New Subject
            </button>
          </div>

          {/* Subjects List */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.length > 0 ? (
              subjects.map((subj) => (
                <div
                  key={subj._id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition relative group"
                >
                  <button
                    onClick={() => handleDeleteSubject(subj._id!)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                    title="Delete subject"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div
                    onClick={() => navigate(`/admin/subjects/${subj._id}`)}
                    className="cursor-pointer"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{subj.name}</h2>
                    <p className="text-sm text-gray-500 mb-2">Code: {subj.code}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{subj.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center col-span-full py-10 border border-dashed border-gray-300 rounded-lg bg-white">
                No subjects created yet.
              </div>
            )}
          </section>

          {message && <p className="text-sm mt-2 font-medium text-green-600">{message}</p>}
        </main>
      </div>

      {/* Modal for Creating Subject */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Subject"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={subject.name}
            onChange={handleChange}
            placeholder="Subject Name"
            required
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="text"
            name="code"
            value={subject.code}
            onChange={handleChange}
            placeholder="Subject Code"
            required
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <textarea
            name="description"
            value={subject.description}
            onChange={handleChange}
            placeholder="Subject Description"
            required
            className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Subject"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
