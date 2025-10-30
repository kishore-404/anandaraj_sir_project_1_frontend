import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentAxios from "../../api/studentAxios";
import {  Loader2, ArrowLeftCircle, Trophy } from "lucide-react";

interface MCQ {
  q: string;
  options: string[];
  answer: string;
}

interface SelfTest {
  mcq: MCQ[];
}

export default function SelfTestPage() {
  const { subjectId, unitId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState<SelfTest | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleGenerate = async () => {
    if (!subjectId || !unitId) return;
    try {
      setLoading(true);
      const res = await studentAxios.post(
        `/subjects/${subjectId}/units/${unitId}/selftest`
      );
      setTest(res.data.test);
      setAnswers({});
      setScore(null);
      setSubmitted(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to generate self test");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!test) return;
    let correctCount = 0;
    const total = test.mcq.length;

    test.mcq.forEach((q, i) => {
      const studentAns = answers[`mcq-${i}`] || "";
      if (studentAns.trim().toLowerCase() === q.answer.trim().toLowerCase())
        correctCount++;
    });

    const percent = total ? Math.round((correctCount / total) * 100) : 0;
    setScore(percent);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 py-10 px-4 relative overflow-hidden">
      {/* 🔹 Decorative gradient circles */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-pink-400 to-yellow-400 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl p-8 relative z-10">
        {/* 🔹 Header */}
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-all"
          >
            <ArrowLeftCircle size={20} />
            Back
          </button> <br />
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          

          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 mt-4 sm:mt-0">
             Self Test
          </h1>
        </div>

        {/* 🔹 Generate Button */}
        {!test && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`px-8 py-4 text-lg font-semibold rounded-xl shadow-md transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </div>
              ) : (
                "Generate 20 MCQs"
              )}
            </button>
          </div>
        )}

        {/* 🔹 MCQ Section */}
        {test && (
          <div className="mt-10 space-y-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 text-center">
              Multiple Choice Questions
            </h2>

            {test.mcq.map((item, idx) => (
              <div
                key={idx}
                className="p-5 border border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
              >
                <p className="font-semibold mb-3 text-gray-800 text-lg">
                  {idx + 1}. {item.q}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.options.map((opt, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                        answers[`mcq-${idx}`] === opt
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-400"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`mcq-${idx}`}
                        value={opt}
                        disabled={submitted}
                        checked={answers[`mcq-${idx}`] === opt}
                        onChange={(e) =>
                          handleChange(`mcq-${idx}`, e.target.value)
                        }
                        className="accent-blue-600"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>

                {submitted && (
                  <p
                    className={`mt-3 text-sm font-semibold ${
                      answers[`mcq-${idx}`]?.trim().toLowerCase() ===
                      item.answer.trim().toLowerCase()
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ✅ Correct answer: {item.answer}
                  </p>
                )}
              </div>
            ))}

            {/* 🔹 Submit / Score Section */}
            <div className="flex flex-col items-center mt-10">
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Submit Test
                </button>
              ) : (
                <div className="text-center mt-6">
                  <div className="flex justify-center mb-4">
                    <Trophy
                      size={48}
                      className={`${
                        score && score >= 60
                          ? "text-green-500"
                          : "text-red-500"
                      } animate-bounce`}
                    />
                  </div>
                  <h3 className="text-3xl font-extrabold text-gray-800">
                     Your Score:{" "}
                    <span
                      className={`${
                        score && score >= 60
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {score}%
                    </span>
                  </h3>
                  <p className="text-gray-500 mt-2">
                    {score && score >= 60
                      ? "Awesome work! Keep pushing your limits."
                      : "Don’t worry — every mistake is a step toward mastery!"}
                  </p>
                  <button
                    onClick={handleGenerate}
                    className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
