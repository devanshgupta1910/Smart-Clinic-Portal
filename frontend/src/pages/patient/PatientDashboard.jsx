import { useEffect, useState } from "react";
import axios from "axios";  
import {jwtDecode} from "jwt-decode";
import {
  FaDownload,
  FaUserMd,
  FaCalendarAlt,
  FaUserCircle,
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
    { name: "Cardiology", icon: <FaHeartbeat /> },
    { name: "Neurology", icon: <FaBrain /> },
    { name: "Orthopedics", icon: <FaBone /> },
    { name: "Pediatrics", icon: <FaChild /> },
    { name: "Gynecology", icon: <FaFemale /> },
    { name: "Dermatology", icon: <FaSmileBeam /> },
    { name: "Radiology", icon: <FaXRay /> },
    { name: "Oncology", icon: <FaRibbon /> },
    { name: "Urology", icon: <FaToilet /> },
    { name: "Gastroenterology", icon: <FaStethoscope /> },
    { name: "Psychiatry", icon: <FaHeadSideVirus /> },
    { name: "ENT", icon: <FaAssistiveListeningSystems /> },
    { name: "Ophthalmology", icon: <FaEye /> },
    { name: "Nephrology", icon: <FaTint /> },
    { name: "Pulmonology", icon: <FaLungs /> },
    { name: "Anesthesiology", icon: <FaSyringe /> },
    { name: "Endocrinology", icon: <FaBalanceScale /> },
    { name: "Rheumatology", icon: <FaNotesMedical /> },
    { name: "General Medicine", icon: <FaUserMd /> },
    { name: "General Surgery", icon: <FaCut /> },
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
        headers: { Authorization: token }, // Add token to headers
      });
      setAppointments(response.data); // Ensure response is an array
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]); // Prevent state from being undefined
    }
  };
  const handleDownload = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/prescriptions/${appointmentId}`, {
        headers: { Authorization: token },
      });
  
      const prescriptionURL = response.data.prescriptionURL;
  
      if (!prescriptionURL) {
        alert("No prescription file found.");
        return;
      }
  
      // Open the image in a new tab
      window.open(prescriptionURL, "_blank");
    } catch (error) {
      console.error("Error fetching prescription:", error);
      alert("Failed to fetch prescription.");
    }
  };
  

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Patient Dashboard</h2>
        <div className="relative">
          <FaUserCircle
            className="text-3xl text-gray-700 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-2">
              <button
                onClick={() => navigate("/patient/profile")}
                className="block w-full text-left p-2 hover:bg-gray-200"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left p-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left - Appointments */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No previous appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-lg font-semibold flex items-center">
                      <FaUserMd className="text-blue-500 mr-2" /> {appointment.doctor}
                    </h4>
                    <p className="text-gray-600 flex items-center">
                      <FaCalendarAlt className="mr-2" /> {appointment.date}
                    </p>
                    <p
                      className={`mt-1 ${
                        appointment.status === "Completed"
                          ? "text-green-600"
                          : "text-yellow-500"
                      }`}
                    >
                      {appointment.status}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(appointment._id)}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    <FaDownload className="mr-2" /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right - Departments List */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-md flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Departments</h3>
          <div className="overflow-y-auto max-h-[400px] pr-2">
            {departments.map((dept, index) => (
              <div
                key={index}
                onClick={() => navigate(`/patient/doctors/${dept.name}`)}
                className="flex items-center space-x-4 p-3 border-b hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <div className="text-blue-500 text-xl">{dept.icon}</div>
                <p className="text-gray-700">{dept.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
