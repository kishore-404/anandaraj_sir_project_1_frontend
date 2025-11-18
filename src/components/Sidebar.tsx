import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";

interface AdminSidebarProps {
  adminName: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const Sidebar: React.FC<AdminSidebarProps> = ({
  adminName,
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Smart LMS</h1>
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col p-4 space-y-2">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/students")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            <LayoutDashboard size={18} />
            View Students
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
    </>
  );
};

export default Sidebar;
