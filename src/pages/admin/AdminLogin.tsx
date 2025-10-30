import { useState } from "react";
import { LogIn } from "lucide-react";
import axiosInstance from "../../api/axios";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/admin/login", formData);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  from-gray-100 via-gray-50 to-gray-100 px-4">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-blue-600 text-white p-3 rounded-full shadow">
              <LogIn size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Admin Login
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              placeholder="Enter your admin ID"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-medium shadow-md transition 
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Smart LMS — Admin Portal
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
