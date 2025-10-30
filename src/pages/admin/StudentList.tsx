import { useEffect, useState } from "react";
import adminAxios from "../../api/axios";

interface Student {
  _id: string;
  name: string;
  department: string;
  registerNumber: string;
  email: string;
  createdAt: string;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await adminAxios.get("/students");
      setStudents(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">👩‍🎓 Student List</h1>

      <input
        type="text"
        placeholder="Search by name, dept, or reg. no..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-3 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center">No students found.</p>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-3 text-left">Name</th>
              <th className="py-2 px-3 text-left">Department</th>
              <th className="py-2 px-3 text-left">Register No.</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Joined On</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-3">{s.name}</td>
                <td className="py-2 px-3">{s.department}</td>
                <td className="py-2 px-3">{s.registerNumber}</td>
                <td className="py-2 px-3">{s.email}</td>
                <td className="py-2 px-3">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
