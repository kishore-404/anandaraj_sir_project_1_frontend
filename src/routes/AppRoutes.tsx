import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import AdminLogin from "../pages/admin/AdminLogin.tsx";
import StudentDashboard from "../pages/students/StudentDashboard.tsx";
import AdminDashboard from "../pages/admin/AdminDashboard.tsx";
import NotFound from "../pages/NotFound.tsx";
import SubjectDetails from "../pages/admin/SubjectDetails.tsx";
import CreateUnit from "../pages/admin/CreateUnit.tsx";
import UnitDetails from "../pages/admin/UnitDetails.tsx";
import StudentLogin from "../pages/students/StudentLogin.tsx";
import StudentProfileSetup from "../pages/students/CompleteProfile.tsx";
import StudentSubjectDetails from "../pages/students/StudentSubjectDetails.tsx";
import StudentUnitDetails from "../pages/students/StudentUnitDetails.tsx";
import SelfTestPage from "../pages/students/StudentSelfTest.tsx";
import StudentList from "../pages/admin/StudentList.tsx";

const RouteWrapper = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <>
     
      <Routes>
        {/* 👇 Default route redirects to student login */}
        <Route path="/" element={<Navigate to="/student/login" replace />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
         <Route path="/admin/students" element={<StudentList />} />
         
        <Route path="/admin/subjects/:subjectId" element={<SubjectDetails />} />
        <Route
          path="/admin/subjects/:subjectId/units/create"
          element={<CreateUnit />}
        />
        <Route
          path="/admin/subjects/:subjectId/units/:unitId"
          element={<UnitDetails />}
        />

        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/setup" element={<StudentProfileSetup />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route
          path="/student/subjects/:subjectId"
          element={<StudentSubjectDetails />}
        />
        <Route
          path="/student/subjects/:subjectId/units/:unitId"
          element={<StudentUnitDetails />}
        />
        <Route
          path="/student/subjects/:subjectId/units/:unitId/selftest"
          element={<SelfTestPage />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <RouteWrapper />
    </BrowserRouter>
  );
};

export default AppRoutes;
