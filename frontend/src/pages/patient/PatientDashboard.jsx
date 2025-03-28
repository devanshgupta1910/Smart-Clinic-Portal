import { useEffect, useState } from "react";
import { FaDownload, FaUserMd, FaCalendarAlt, FaSearch, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/patient/appointments")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((error) => console.error("Error fetching appointments:", error));
  }, []);

  const handleDownload = (prescriptionUrl) => {
    const link = document.createElement("a");
    link.href = prescriptionUrl;
    link.download = "Prescription.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearch = () => {
    fetch(`http://localhost:5000/api/doctors?specialization=${specialty}`)
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((error) => console.error("Error fetching doctors:", error));
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
              <button onClick={() => navigate("/patient/profile")} className="block w-full text-left p-2 hover:bg-gray-200">Profile</button>
              <button onClick={handleLogout} className="block w-full text-left p-2 hover:bg-gray-200">Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Left: Appointments, Right: Doctor Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Appointments */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No previous appointments found.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold flex items-center">
                      <FaUserMd className="text-blue-500 mr-2" /> {appointment.doctor}
                    </h4>
                    <p className="text-gray-600 flex items-center">
                      <FaCalendarAlt className="mr-2" /> {appointment.date}
                    </p>
                    <p className={`mt-1 ${appointment.status === "Completed" ? "text-green-600" : "text-yellow-500"}`}>
                      {appointment.status}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(appointment.prescriptionUrl)}
                    className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    <FaDownload className="mr-2" /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Search Doctors */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Find a Doctor</h3>
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search by specialty..."
              className="w-full p-2 border rounded-lg"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </div>

          {doctors.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Available Doctors</h4>
              {doctors.map((doctor) => (
                <div key={doctor.id} className="p-3 border-b flex justify-between items-center">
                  <p>{doctor.name} - {doctor.specialization}</p>
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
