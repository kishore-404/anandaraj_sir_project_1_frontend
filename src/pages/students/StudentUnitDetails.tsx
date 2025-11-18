import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentAxios from "../../api/studentAxios";
import { ArrowLeftCircle, BookOpen, HelpCircle } from "lucide-react";

interface QA {
  q: string;
  a: string;
}

interface Unit {
  _id: string;
  title: string;
  description: string;
  unitFileUrl?: string;
  twoMarkFileUrl?: string;
  fiveMarkFileUrl?: string;
  tenMarkFileUrl?: string;
  generatedTwoMark: QA[];
  generatedFiveMark: QA[];
  generatedTenMark: QA[];
  subject?: {
    name: string;
    code: string;
  };
}

const StudentUnitDetails: React.FC = () => {
  const { subjectId, unitId } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"2" | "5" | "10" | null>(null);

  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [studentQuestion, setStudentQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const fetchUnit = async () => {
    try {
      const res = await studentAxios.get(`/subjects/${subjectId}/units/${unitId}`);
      setUnit(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load unit details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnit();
  }, [subjectId, unitId]);

  const handleAskDoubt = async () => {
    if (!studentQuestion.trim()) return alert("Please enter a question!");
    setLoadingAnswer(true);
    setAiAnswer("");
    try {
      const res = await studentAxios.post("/student/doubt", {
        question: studentQuestion,
        subjectId,
        unitId,
      });
      setAiAnswer(res.data.answer || "No answer found.");
    } catch {
      setAiAnswer("⚠️ Failed to get answer. Try again later.");
    } finally {
      setLoadingAnswer(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-white bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 animate-pulse">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg bg-gray-100">
        {error}
      </div>
    );

  if (!unit)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 bg-gray-50">
        No unit found
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 py-10 px-4 relative overflow-hidden">
      {/* 🔹 Floating blurred circles (background aesthetics) */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-pink-400 to-yellow-400 rounded-full blur-3xl opacity-30"></div>

      {/* 🔹 Main Card */}
      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl p-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-all mb-4"
        >
          <ArrowLeftCircle size={20} /> Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 mt-4 sm:mt-0">
            <BookOpen className="text-purple-600" size={30} /> Unit Details
          </h1>
        </div>

        {/* Unit Info */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            {unit.title}
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">{unit.description}</p>
          {unit.subject && (
            <p className="text-gray-500 mt-2 italic">
              Subject: <strong>{unit.subject.name}</strong> ({unit.subject.code})
            </p>
          )}
        </div>

        {/* Uploaded Files */}
        <h3 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          📂 Uploaded Files
        </h3>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          // Inside the JSX where you render uploaded files:
{unit.unitFileUrl && (
  <a
    href={`https://anandaraj-sir-project-1-backend.onrender.com${unit.unitFileUrl}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
  >
     Unit File
  </a>
)}
{unit.twoMarkFileUrl && (
  <a
    href={`https://anandaraj-sir-project-1-backend.onrender.com${unit.twoMarkFileUrl}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-5 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
  >
     2 Mark File
  </a>
)}
{unit.fiveMarkFileUrl && (
  <a
    href={`https://anandaraj-sir-project-1-backend.onrender.com${unit.fiveMarkFileUrl}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-5 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
  >
     5 Mark File
  </a>
)}
{unit.tenMarkFileUrl && (
  <a
    href={`https://anandaraj-sir-project-1-backend.onrender.com${unit.tenMarkFileUrl}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
  >
     10 Mark File
  </a>
)}

        </div>
        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <button
            onClick={() =>
              navigate(`/student/subjects/${subjectId}/units/${unitId}/selftest`)
            }
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all"
          >
          Start Self Test
          </button>
          <button
            onClick={() => setShowDoubtModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all"
          >
            <HelpCircle size={20} /> Ask Doubt
          </button>
        </div><br />

        {/* Marks Section Buttons */}
        <h3 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
           Questions
        </h3>
        <div className="flex justify-center flex-wrap gap-4 mb-6">
          {["2", "5", "10"].map((mark) => (
            <button
              key={mark}
              onClick={() => setActiveSection(activeSection === mark ? null : (mark as any))}
              className={`px-5 py-3 rounded-xl text-white font-semibold shadow-md transition-all ${
                activeSection === mark
                  ? "scale-105 bg-gradient-to-r from-purple-600 to-pink-500"
                  : "bg-gradient-to-r from-blue-400 to-indigo-400 hover:scale-105"
              }`}
            >
              {mark} Mark Questions
            </button>
          ))}
        </div>

        {/* Questions Display */}
        <div className="space-y-4">
          {activeSection === "2" &&
            unit.generatedTwoMark.map((item, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <p className="font-semibold text-gray-800">
                  {i + 1}. {item.q}
                </p>
                <p className="text-gray-600 mt-1">{item.a}</p>
              </div>
            ))}
          {activeSection === "5" &&
            unit.generatedFiveMark.map((item, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <p className="font-semibold text-gray-800">
                  {i + 1}. {item.q}
                </p>
                <p className="text-gray-600 mt-1">{item.a}</p>
              </div>
            ))}
          {activeSection === "10" &&
            unit.generatedTenMark.map((item, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-xl p-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <p className="font-semibold text-gray-800">
                  {i + 1}. {item.q}
                </p>
                <p className="text-gray-600 mt-1">{item.a}</p>
              </div>
            ))}
        </div>

        
      </div>

      {/* 💬 Doubt Modal */}
      {showDoubtModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-3">💬 Ask a Doubt</h2>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 h-28 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Type your question..."
              value={studentQuestion}
              onChange={(e) => setStudentQuestion(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDoubtModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAskDoubt}
                disabled={loadingAnswer}
                className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                  loadingAnswer
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-teal-500 hover:scale-105"
                }`}
              >
                {loadingAnswer ? "Generating..." : "Ask "}
              </button>
            </div>
            {aiAnswer && (
              <div className="mt-4 border-t pt-3 text-gray-800">
                <p className="font-semibold text-indigo-600"> Answer:</p>
                <p className="mt-2 whitespace-pre-line">{aiAnswer}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentUnitDetails;
