import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const StudentAuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("studentToken", token);
      navigate("/student/dashboard");
    } else {
      navigate("/student/login");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
      <p>Logging you in...</p>
    </div>
  );
};

export default StudentAuthHandler;
