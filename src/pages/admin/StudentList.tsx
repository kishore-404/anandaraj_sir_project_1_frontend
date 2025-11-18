// src/pages/admin/StudentList.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import AdminSidebar from "../../components/Sidebar";
import Loader from "../../components/Loader";
import { Menu, Trash2, X } from "lucide-react";

interface Student {
  _id: string;
  name?: string;
  email: string;
  department?: string;
  createdAt?: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [adminName, setAdminName] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("tokenData");
    if (userData) {
      const parsed = JSON.parse(userData);
      setAdminName(parsed.name);
    } else {
      setAdminName("Admin");
    }
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/students", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axiosInstance.delete(`/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenData");
    window.location.href = "/admin/login";
  };

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar
        adminName={adminName}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col p-6 sm:p-8">
        <header className="md:hidden flex items-center justify-between bg-white shadow p-4 mb-4">
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

        <h1 className="text-2xl font-semibold mb-4">All Students</h1>

        {students.length === 0 ? (
          <p>No students registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2 hidden sm:table-cell">Email</th>
                  <th className="border px-4 py-2">Department</th>
                  <th className="border px-4 py-2 hidden md:table-cell">Joined On</th>
                  <th className="border px-4 py-2 hidden md:table-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="border px-4 py-2">{student.name || "-"}</td>
                    <td className="border px-4 py-2 hidden sm:table-cell">{student.email}</td>
                    <td className="border px-4 py-2">{student.department || "-"}</td>
                    <td className="border px-4 py-2 hidden md:table-cell">
                      {student.createdAt
                        ? new Date(student.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="border px-4 py-2 hidden md:table-cell text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent modal opening
                          handleDeleteStudent(student._id);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Student"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">{selectedStudent.name}</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Department:</strong> {selectedStudent.department || "-"}</p>
              <p>
                <strong>Joined On:</strong>{" "}
                {selectedStudent.createdAt
                  ? new Date(selectedStudent.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
