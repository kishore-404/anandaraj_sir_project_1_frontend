import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import studentAxios from "../../api/studentAxios";
import { LogOut, BookOpen, GraduationCap } from "lucide-react";

interface Subject {
  _id: string;
  name: string;
  code: string;
  description: string;
}

const motivationalQuotes = [
  "Learning never exhausts the mind.",
  "Dream big. Work hard. Stay humble.",
  "The expert in anything was once a beginner.",
  "Success doesn’t come to you, you go to it.",
  "Push yourself, because no one else is going to do it for you.",
  "Small progress is still progress.",
  "You are capable of more than you think.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Your future depends on what you do today.",
  "Doubt kills more dreams than failure ever will.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Learn as if you were to live forever.",
  "Hard work beats talent when talent doesn’t work hard.",
  "Great things never come from comfort zones.",
  "You don’t have to be perfect to be amazing.",
  "Focus on being productive instead of busy.",
  "Every day is a new opportunity to learn and grow.",
  "Your dreams don’t work unless you do.",
  "Knowledge is power — and power begins with curiosity.",
  "Don’t limit your challenges. Challenge your limits.",
];

const StudentDashboard = () => {
  const [student, setStudent] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await studentAxios.get("/auth/me");
        setStudent(res.data);
      } catch (err) {
        navigate("/student/login");
      }
    };
    fetchStudent();
  }, [navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await studentAxios.get("/subjects");
        setSubjects(res.data);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    // Pick a random motivational quote each visit
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[randomIndex]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    navigate("/student/login");
  };

  if (!student) return <div className="text-center mt-10">Loading student...</div>;
  if (loading) return <div className="text-center mt-10">Loading subjects...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 flex flex-col text-gray-800">
      {/* 🔹 Glassmorphism Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-white/70 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-blue-600" size={28} />
            <div>
              <h1 className="text-lg font-semibold">{student.name}</h1>
              <p className="text-sm text-gray-500">{student.department}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* 🔹 Vibrant Hero Section */}
      <section className="relative mt-20 overflow-hidden py-16 px-6 text-center">
        {/* Gradient geometric background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-10 w-56 h-56 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 right-10 w-72 h-72 bg-gradient-to-tr from-pink-400 to-yellow-400 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-indigo-300 to-teal-400 rotate-45 rounded-3xl blur-2xl opacity-20"></div>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
          Welcome Back,{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
            {student.name?.split(" ")[0]}
          </span>
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">
          {quote}
        </p>
        <p className="text-gray-500">
          “A journey of learning begins with curiosity — keep growing every day.”
        </p>
      </section>

      {/* 🔹 Subjects Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" /> Your Courses
          </h3>
        </div>

        {subjects.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No subjects assigned yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subj) => (
              <div
                key={subj._id}
                onClick={() => navigate(`/student/subjects/${subj._id}`)}
                className="relative group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl 
                  hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Gradient accent background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 blur-2xl"></div>

                <div className="relative z-10">
                  <h4 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition mb-2">
                    {subj.name}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Code: {subj.code}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {subj.description}
                  </p>
                  <button className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium group-hover:underline">
                    View Course →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🔹 Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-gray-500 text-sm bg-white/40 backdrop-blur-sm">
        SmartLMS © {new Date().getFullYear()} — Learn. Grow. Achieve.
      </footer>
    </div>
  );
};

export default StudentDashboard;
