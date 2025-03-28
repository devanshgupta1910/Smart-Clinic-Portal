import { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserCircle, FaUser, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/doctor/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((error) => console.error("Error fetching appointments:", error));
  }, []);

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Doctor Dashboard</h2>
        <div className="relative">
          <FaUserCircle
            className="text-3xl text-gray-700 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-2">
              <button onClick={() => navigate("/doctor/profile")} className="block w-full text-left p-2 hover:bg-gray-200">
                Profile
              </button>
              <button onClick={handleLogout} className="block w-full text-left p-2 hover:bg-gray-200">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold flex items-center">
                    <FaUser className="text-blue-500 mr-2" /> {appointment.patient}
                  </h4>
                  <p className="text-gray-600 flex items-center">
                    <FaCalendarAlt className="mr-2" /> {appointment.date}
                  </p>
                  <p className={`mt-1 ${appointment.status === "Completed" ? "text-green-600" : "text-yellow-500"}`}>
                    {appointment.status}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-200">
                    <FaCheck className="mr-2" /> Complete
                  </button>
                  <button className="flex items-center bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200">
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
