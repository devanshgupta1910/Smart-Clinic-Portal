import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookAppointmentPopup from "./BookAppointment"; // Import popup component

export default function DepartmentDoctors() {
  const { department } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctors/approved/${department}`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error.response?.data || error.message);
      }
    };
    fetchDoctors();
  }, [department]);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">{department} Doctors</h2>
      {doctors.length === 0 ? (
        <p className="text-center text-gray-500">No doctors found in {department}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
              <img
                src={doctor.imageUrl || "https://cdn-icons-png.flaticon.com/512/3870/3870822.png"}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-300"
              />
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-gray-700">{doctor.name}</h3>
                <p className="text-gray-500">{doctor.specialization}</p>
                <p className="text-gray-600 font-medium">📞 {doctor.phone}</p>
                <button
                  onClick={() => setSelectedDoctor(doctor._id)} // Open popup
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show popup if a doctor is selected */}
      {selectedDoctor && (
        <BookAppointmentPopup
          doctorId={selectedDoctor}
          closePopup={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
}