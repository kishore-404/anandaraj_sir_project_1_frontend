import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import studentAxios from "../../api/studentAxios";
import { GraduationCap, Sparkles } from "lucide-react";

const motivationalQuotes = [
  "Learning never exhausts the mind.",
  "Dream big. Work hard. Stay humble.",
  "The expert in anything was once a beginner.",
  "Success doesn’t come to you, you go to it.",
  "Small progress is still progress.",
  "Push yourself, because no one else is going to do it for you.",
  "Your future depends on what you do today.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Knowledge is power — and power begins with curiosity.",
  "Doubt kills more dreams than failure ever will.",
];

export default function StudentLogin() {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Clear old token so new student setup will run correctly
    localStorage.removeItem("studentToken");

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("studentToken", token);

      // Set token in Axios header
      studentAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      studentAxios
        .get("/auth/me")
        .then((res) => {
          const student = res.data;

          if (!student.name || !student.department) {
            navigate("/student/setup");
          } else {
            navigate("/student/dashboard");
          }
        })
        .catch(() => navigate("/student/login"));
    }
  }, [navigate]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  const handleGoogleLogin = () => {
    window.location.href =
      "https://anandaraj-sir-project-1-backend.onrender.com/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* 🔹 Decorative Gradient Circles */}
      <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-gradient-to-tr from-pink-400 to-yellow-300 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      {/* 🔹 Login Card */}
      <div className="relative z-10 bg-white/70 backdrop-blur-lg border border-gray-200 shadow-2xl p-10 rounded-2xl w-[90%] sm:w-[25rem] text-center">
        {/* Icon + Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md mb-4">
            <GraduationCap size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome to SmartLMS</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to continue your learning journey</p>
        </div>

        {/* 🔹 Motivational Quote */}
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-100/60 to-purple-100/60 rounded-lg px-4 py-3 mb-6">
          <Sparkles className="text-blue-600" size={18} />
          <p className="text-gray-700 italic text-sm">{quote}</p>
        </div>

        {/* 🔹 Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          Sign in with Google
        </button>

        {/* 🔹 Footer Text */}
        <p className="text-xs text-gray-500 mt-6">
          By continuing, you agree to our{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">Terms</span> and{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>.
        </p>

        <footer className="mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} SmartLMS — Learn. Grow. Achieve.
        </footer>
      </div>
    </div>
  );
}
