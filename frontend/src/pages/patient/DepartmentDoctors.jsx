import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DepartmentDoctors() {
  const { department } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctors/approved?department=${department}`);
        console.log("Response:", response);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error.response?.data || error.message);
      }
    };
    fetchDoctors();
  }, [department]);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">{department} Doctors</h2>
      {doctors.length === 0 ? (
        <p>No doctors found in {department}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white p-4 rounded shadow flex items-center gap-4">
              <img
                src={doctor.imageUrl || "https://cdn-icons-png.flaticon.com/512/3870/3870822.png"}
                alt={doctor.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{doctor.name}</h3>
                <p>{doctor.specialization}</p>
                <p>📞 {doctor.phone}</p>
                <button
                  onClick={() => navigate(`/patient/book/${encodeURIComponent(doctor.name)}`)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
