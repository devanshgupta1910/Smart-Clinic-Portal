import { useEffect, useState } from "react";
import axios from "axios";  
import { jwtDecode } from "jwt-decode";
import {
  FaDownload,
  FaUserMd,
  FaCalendarAlt,
  FaUserCircle,
  FaClock,
  FaHeartbeat,
  FaBrain,
  FaBone,
  FaChild,
  FaFemale,
  FaSmileBeam,
  FaXRay,
  FaRibbon,
  FaToilet,
  FaStethoscope,
  FaHeadSideVirus,
  FaAssistiveListeningSystems,
  FaEye,
  FaTint,
  FaLungs,
  FaSyringe,
  FaBalanceScale,
  FaNotesMedical,
  FaCut
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const departments = [
    { name: "Cardiology", icon: <FaHeartbeat className="text-blue-600" /> },
    { name: "Neurology", icon: <FaBrain className="text-blue-600" /> },
    { name: "Orthopedics", icon: <FaBone className="text-blue-600" /> },
    { name: "Pediatrics", icon: <FaChild className="text-blue-600" /> },
    { name: "Gynecology", icon: <FaFemale className="text-blue-600" /> },
    { name: "Dermatology", icon: <FaSmileBeam className="text-blue-600" /> },
    { name: "Radiology", icon: <FaXRay className="text-blue-600" /> },
    { name: "Oncology", icon: <FaRibbon className="text-blue-600" /> },
    { name: "Urology", icon: <FaToilet className="text-blue-600" /> },
    { name: "Gastroenterology", icon: <FaStethoscope className="text-blue-600" /> },
    { name: "Psychiatry", icon: <FaHeadSideVirus className="text-blue-600" /> },
    { name: "ENT", icon: <FaAssistiveListeningSystems className="text-blue-600" /> },
    { name: "Ophthalmology", icon: <FaEye className="text-blue-600" /> },
    { name: "Nephrology", icon: <FaTint className="text-blue-600" /> },
    { name: "Pulmonology", icon: <FaLungs className="text-blue-600" /> },
    { name: "Anesthesiology", icon: <FaSyringe className="text-blue-600" /> },
    { name: "Endocrinology", icon: <FaBalanceScale className="text-blue-600" /> },
    { name: "Rheumatology", icon: <FaNotesMedical className="text-blue-600" /> },
    { name: "General Medicine", icon: <FaUserMd className="text-blue-600" /> },
    { name: "General Surgery", icon: <FaCut className="text-blue-600" /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {  
      navigate("/login");  
      return;  
    }  
    fetchAppointments(token);
  }, [navigate]);
  
  const fetchAppointments = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointments/all", {
        headers: { Authorization: token },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white shadow-lg p-4 rounded-lg mb-6">
        <h2 className="text-3xl font-bold text-blue-800">Patient Dashboard</h2>
        <div className="relative">
          <FaUserCircle
            className="text-4xl text-blue-700 cursor-pointer hover:text-blue-500 transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 border border-blue-300">
              <button 
                onClick={() => navigate("/patient/profile")} 
                className="block w-full text-left p-2 text-blue-800 hover:bg-blue-100 rounded-md"
              >
                Profile
              </button>
              <button 
                onClick={() => alert("Logging out...") || navigate("/login")} 
                className="block w-full text-left p-2 text-blue-800 hover:bg-blue-100 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg max-h-[500px] overflow-y-scroll">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Your Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No previous appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments
                .sort((a, b) => {
                  const aDateTime = new Date(`${a.date.split("T")[0]}T${String(a.timeSlot).padStart(2, "0")}:00:00`);
                  const bDateTime = new Date(`${b.date.split("T")[0]}T${String(b.timeSlot).padStart(2, "0")}:00:00`);
                
                  if (a.status === "pending" && b.status === "completed") return -1;
                  if (a.status === "completed" && b.status === "pending") return 1;
                
                  // For completed appointments, sort in descending order (newest first)
                  if (a.status === "completed" && b.status === "completed") {
                    return bDateTime - aDateTime;
                  }
                
                  // For pending appointments, sort in ascending order (soonest first)
                  return aDateTime - bDateTime;
                })
                .map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-blue-50 p-4 rounded-lg shadow-md flex justify-between items-center border border-blue-300"
                  >
                    <div>
                      <h4 className="text-lg font-semibold flex items-center text-blue-700">
                        <FaUserMd className="mr-2 text-blue-600" /> {appointment.doctor}
                      </h4>
                      <p className="text-gray-700 flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-500" /> Date: {appointment.date.split("T")[0]}
                      </p>
                      <p className="text-gray-700 flex items-center">
                        <FaClock className="mr-2 text-blue-500" /> Time: {appointment.timeSlot}:00
                      </p>
                      <p
                        className={`text-sm font-semibold mt-1 ${
                          appointment.status === "completed" ? "text-green-600" : "text-yellow-600"
                        }`}
                      >
                        Status: {appointment.status === "completed" ? "Completed" : "Pending"}
                      </p>
                    </div>
                    <button className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">
                      <FaDownload className="mr-2" /> Download
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Departments */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg max-h-[500px] overflow-y-scroll">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Departments</h3>
          <div className="overflow-y-auto max-h-[400px] pr-2">
            {departments.map((dept, index) => (
              <div key={index} onClick={() => navigate(`/patient/doctors/${dept.name}`)} className="flex items-center space-x-4 p-3 border-b hover:bg-blue-50 rounded-lg cursor-pointer transition border-blue-200">
                {dept.icon}
                <p className="text-blue-700 font-medium">{dept.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
