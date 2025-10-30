import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

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

export default function UnitDetails() {
  const { subjectId, unitId } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<"2" | "5" | "10" | null>(null);

  const fetchUnit = async () => {
    try {
      const res = await axios.get(`/subjects/${subjectId}/units/${unitId}`);
      const normalized: Unit = {
        ...res.data,
        generatedTwoMark: res.data.generatedTwoMark || [],
        generatedFiveMark: res.data.generatedFiveMark || [],
        generatedTenMark: res.data.generatedTenMark || [],
      };
      setUnit(normalized);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load unit details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnit();
  }, [subjectId, unitId]);

  const handleRegenerate = async () => {
    if (!subjectId || !unitId) return;
    try {
      setRegenerating(true);
      await axios.post(`/subjects/${subjectId}/units/${unitId}/generate`);
      await fetchUnit();
      alert("✅ Questions regenerated successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error regenerating questions");
    } finally {
      setRegenerating(false);
    }
  };

  const toggleSection = (type: "2" | "5" | "10") => {
    setActiveSection(activeSection === type ? null : type);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!unit) return <p className="text-center text-gray-500">No unit found</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-2xl mt-6 border border-gray-200">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 transition font-medium"
      >
        ← Back to Units
      </button>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{unit.title}</h1>
          <p className="text-gray-600 mt-1">{unit.description}</p>
          {unit.subject && (
            <p className="text-sm text-gray-500 mt-1">
              Subject: <strong>{unit.subject.name}</strong> ({unit.subject.code})
            </p>
          )}
        </div>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className={`${
            regenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2`}
        >
          {regenerating ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Regenerating...
            </>
          ) : (
            <>
              🔄 Regenerate Questions
            </>
          )}
        </button>
      </div>

      {/* Uploaded Files */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Uploaded Files
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {unit.unitFileUrl && (
            <a
              href={`http://localhost:5000${unit.unitFileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-400 transition"
            >
              📘 Main Unit File
            </a>
          )}
          {unit.twoMarkFileUrl && (
            <a
              href={`http://localhost:5000${unit.twoMarkFileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-400 transition"
            >
              ✏️ 2 Mark File
            </a>
          )}
          {unit.fiveMarkFileUrl && (
            <a
              href={`http://localhost:5000${unit.fiveMarkFileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-400 transition"
            >
              📝 5 Mark File
            </a>
          )}
          {unit.tenMarkFileUrl && (
            <a
              href={`http://localhost:5000${unit.tenMarkFileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-400 transition"
            >
              📄 10 Mark File
            </a>
          )}
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-3 mt-8">
        <button
          onClick={() => toggleSection("2")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            activeSection === "2"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-blue-50 text-gray-700"
          }`}
        >
          2 Mark Questions
        </button>

        <button
          onClick={() => toggleSection("5")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            activeSection === "5"
              ? "bg-green-600 text-white"
              : "bg-gray-100 hover:bg-green-50 text-gray-700"
          }`}
        >
          5 Mark Questions
        </button>

        <button
          onClick={() => toggleSection("10")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            activeSection === "10"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 hover:bg-purple-50 text-gray-700"
          }`}
        >
          10 Mark Questions
        </button>
      </div>

      {/* Display Selected Question Set */}
      <div className="mt-6 space-y-4">
        {activeSection === "2" && (
          <QuestionSection
            title="2 Mark Questions"
            questions={unit.generatedTwoMark}
            color="blue"
          />
        )}
        {activeSection === "5" && (
          <QuestionSection
            title="5 Mark Questions"
            questions={unit.generatedFiveMark}
            color="green"
          />
        )}
        {activeSection === "10" && (
          <QuestionSection
            title="10 Mark Questions"
            questions={unit.generatedTenMark}
            color="purple"
          />
        )}
      </div>
    </div>
  );
}

/* ✅ Reusable Question Section Component */
function QuestionSection({
  title,
  questions,
  color,
}: {
  title: string;
  questions: QA[];
  color: "blue" | "green" | "purple";
}) {
  if (questions.length === 0)
    return <p className="text-gray-500 mt-2">No questions available.</p>;

  const borderColor =
    color === "blue"
      ? "border-blue-300"
      : color === "green"
      ? "border-green-300"
      : "border-purple-300";

  const titleColor =
    color === "blue"
      ? "text-blue-700"
      : color === "green"
      ? "text-green-700"
      : "text-purple-700";

  return (
    <div className={`bg-gray-50 border ${borderColor} rounded-xl p-5`}>
      <h3 className={`text-xl font-semibold mb-3 ${titleColor}`}>{title}</h3>
      <ul className="space-y-3">
        {questions.map((item, i) => (
          <li
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <p className="font-medium text-gray-800">Q{i + 1}. {item.q}</p>
            <p className="text-gray-700 text-sm mt-2">{item.a}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
