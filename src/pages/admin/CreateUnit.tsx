import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, Upload, ArrowLeft, Sparkles } from "lucide-react";
import Sidebar from "../../components/Sidebar";
// import { Navbar } from "../../components/Navbar";
import axiosInstance from "../../api/axios";

const CreateUnit: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unitFile, setUnitFile] = useState<File | null>(null);
  const [twoMarkFile, setTwoMarkFile] = useState<File | null>(null);
  const [fiveMarkFile, setFiveMarkFile] = useState<File | null>(null);
  const [tenMarkFile, setTenMarkFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [createdUnitId, setCreatedUnitId] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitFile) return alert("Please upload the main unit file!");
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("unitFile", unitFile);
      if (twoMarkFile) formData.append("twoMarkFile", twoMarkFile);
      if (fiveMarkFile) formData.append("fiveMarkFile", fiveMarkFile);
      if (tenMarkFile) formData.append("tenMarkFile", tenMarkFile);

      const res = await axiosInstance.post(
        `/subjects/${subjectId}/units/create`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCreatedUnitId(res.data.unit._id);
      setMessage("✅ Unit created successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Failed to create unit");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!createdUnitId) return alert("Please create a unit first!");
    setLoading(true);
    setMessage("Generating questions...");

    try {
      const res = await axiosInstance.post(
        `/subjects/${subjectId}/units/${createdUnitId}/generate`
      );
      setGeneratedQuestions(res.data);
      setMessage("✅ Questions generated successfully!");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   window.location.href = "/admin/login";
  // };

  return (
    <div className="flex min-h-screen  from-gray-50 to-gray-100 text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
       

        <main className="flex justify-center items-start p-6 sm:p-10">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all">
            <div className="flex items-center justify-between mb-8">
               <button
                onClick={() => navigate(`/admin/subjects/${subjectId}`)}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm font-medium transition"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
                <FileText className="text-blue-600" size={22} />
                Create New Unit
              </h1>
             
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Unit Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter unit title"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter brief description"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Main Unit File */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Main Unit File <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition">
                  <Upload size={18} className="text-blue-600 shrink-0" />
                  <input
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setUnitFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-gray-700 outline-none"
                  />
                </div>
              </div>

              {/* Optional PDFs */}
              <div>
                <label className="block text-sm font-medium mb-2">Optional Question PDFs</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "2 Mark", setter: setTwoMarkFile },
                    { label: "5 Mark", setter: setFiveMarkFile },
                    { label: "10 Mark", setter: setTenMarkFile },
                  ].map(({ label, setter }, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col border border-gray-300 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Upload size={16} className="text-blue-500 shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setter(e.target.files?.[0] || null)}
                        className="text-sm text-gray-700 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg font-medium text-white transition shadow-md ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Uploading..." : "Create Unit"}
              </button>
            </form>

            {/* After Creation */}
            {createdUnitId && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGenerateQuestions}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 w-full sm:w-1/2"
                >
                  <Sparkles size={18} /> {loading ? "Generating..." : "Generate Questions"}
                </button>
                <button
                  onClick={() => navigate(`/admin/subjects/${subjectId}`)}
                  className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition w-full sm:w-1/2"
                >
                  <ArrowLeft size={18} /> Back to Subject
                </button>
              </div>
            )}

            {/* Status Message */}
            {message && (
              <p className="text-center mt-5 text-sm font-medium text-blue-700">
                {message}
              </p>
            )}

            {/* Generated Questions */}
            {generatedQuestions && (
              <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Generated Questions
                </h2>
                {["generatedTwoMark", "generatedFiveMark", "generatedTenMark"].map(
                  (key) =>
                    generatedQuestions[key]?.length > 0 && (
                      <div key={key} className="mb-4">
                        <h3 className="font-semibold text-blue-700 mb-2">
                          {key.replace("generated", "").replace("Mark", "-Mark")}
                        </h3>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {generatedQuestions[key].map((q: any, i: number) => (
                            <li key={i}>
                              <strong>Q:</strong> {q.q}
                              <br />
                              <strong>A:</strong> {q.a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateUnit;
