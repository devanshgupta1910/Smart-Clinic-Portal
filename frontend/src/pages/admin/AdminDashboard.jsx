import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/doctors", {
        headers: { Authorization: token },
      });

      // Sort: Unapproved doctors first
      const sortedDoctors = response.data.sort((a, b) => a.isApproved - b.isApproved);
      setDoctors(sortedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleApprove = async (doctorId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/doctors/approve/${doctorId}`, {}, {
        headers: { Authorization: token },
      });

      // Refresh doctor list
      fetchDoctors();
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <Link to="/admin/doctors" className="block bg-blue-500 text-white p-2 rounded mb-4 text-center">
        Manage Doctors
      </Link>

      <div className="max-h-[500px] overflow-y-auto border rounded-lg p-4">
        {doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor._id} className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{doctor.name}</h2>
                <p className="text-gray-600">{doctor.specialization} ({doctor.department})</p>
                <p className="text-gray-500">Experience: {doctor.experience} years</p>
                <p className={`font-semibold ${doctor.isApproved ? "text-green-500" : "text-red-500"}`}>
                  {doctor.isApproved ? "Approved" : "Pending Approval"}
                </p>
              </div>

              {!doctor.isApproved && (
                <button
                  onClick={() => handleApprove(doctor._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Approve
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
