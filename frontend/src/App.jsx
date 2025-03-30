import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorRegister from "./pages/DoctorRegister";
import PatientRegister from "./pages/PatientRegister"; 
import PatientDashboard from "./pages/patient/PatientDashboard";
import DepartmentDoctors from "./pages/patient/DepartmentDoctors";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import UploadReport from "./pages/patient/UploadReport";

export default function App() {
  return (
    <Routes>
      {/* 🌟 Default Home Page */}
      <Route path="/" element={<Home />} />

      {/* Authentication Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />
      <Route path="/register/patient" element={<PatientRegister />} />

      {/* Login Routes */}
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Patient Routes */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/patient/book/:doctorId" element={<BookAppointment />} />
      <Route path="/patient/upload" element={<UploadReport />} />
      <Route path="/patient/doctors/:department" element={<DepartmentDoctors />} />

      {/* Doctor Routes */}
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/patients" element={<DoctorPatients />} />

    </Routes>
  );
}
