import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PatientDashboard from "./pages/PatientDashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorSearchPage from "./pages/DoctorSearchPage";
import RegisterPage from "./pages/RegisterPage";
import PatientAppointments from "./pages/PatientAppointments";
import PatientDashboardLayout from "./layouts/PatientDashboardLayout";
import DoctorDashboardLayout from "./layouts/DoctorDashboardLayout";
import DoctorAvailability from "./pages/DoctorAvailability";
import DoctorProfile from "./pages/DoctorProfile";
import BookAppointment from "./pages/BookAppointment";
import DoctorAppointments from "./pages/DoctorAppointments";
import ProfilePage from "./pages/ProfilePage";

const AppRouter = () => {
  return (
    // <Router>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/search" element={<DoctorSearchPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/book-appointment/:id" element={<BookAppointment />} />
      </Route>

      {/* Patient Dashboard Routes */}
      <Route path="/dashboard/patient" element={<PatientDashboardLayout />}>
        <Route path="" element={<PatientDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="appointments" element={<PatientAppointments />} />
      </Route>

      {/* Doctor Dashboard Routes */}
      <Route path="/dashboard/doctor" element={<DoctorDashboardLayout />}>
        <Route path="" element={<DoctorDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="availability" element={<DoctorAvailability />} />
      </Route>

      {/* <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="patient" element={<PatientDashboard />} />
        <Route path="doctor" element={<DoctorDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
      </Route> */}
    </Routes>
    // </Router>
  );
};

export default AppRouter;
