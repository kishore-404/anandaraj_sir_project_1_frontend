import { useState } from "react";
import { useNavigate } from "react-router-dom";
import studentAxios from "../../api/studentAxios";

export default function StudentProfileSetup() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await studentAxios.put("/student/update-profile", { name, department });
      navigate("/student/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-2xl w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          Complete Your Profile
        </h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Enter department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2 w-full rounded-lg"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </form>
    </div>
  );
}
