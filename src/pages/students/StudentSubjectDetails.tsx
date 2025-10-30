import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentAxios from "../../api/studentAxios";
import { BookOpen, ArrowLeftCircle, Layers } from "lucide-react";

interface Unit {
  _id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
}

const StudentSubjectDetails: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const res = await studentAxios.get(`/subjects/${subjectId}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 py-10 px-4 relative overflow-hidden">
      {/* 🔹 Floating blurred circles (same as self test page) */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-pink-400 to-yellow-400 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl p-8 relative z-10">
        {/* Header */}
         <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-all"
          >
            <ArrowLeftCircle size={20} />
            Back
          </button>
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
         

          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3 mt-4 sm:mt-0">
            <BookOpen className="text-blue-600" size={30} /> Subject Details
          </h1>
        </div>

        {/* Subject Info */}
        {subject && (
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              {subject.name}
            </h2>
            <p className="text-gray-700">
              <span className="font-semibold">Code:</span> {subject.code}
            </p>
            <p className="text-gray-500 mt-2 italic">{subject.description}</p>
          </div>
        )}

        {/* Units */}
        <h3 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex justify-center items-center gap-2">
          <Layers className="text-blue-600" /> Units
        </h3>

        {units.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((unit) => (
              <div
                key={unit._id}
                onClick={() =>
                  navigate(`/student/subjects/${subjectId}/units/${unit._id}`)
                }
                className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-all">
                  {unit.title}
                </h4>
                {unit.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {unit.description}
                  </p>
                )}
                {unit.fileUrl && (
                  <a
                    href={unit.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-600 shadow-md hover:shadow-xl transition-all"
                  >
                    📄 View {unit.fileType?.toUpperCase()}
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No units available for this subject yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentSubjectDetails;
