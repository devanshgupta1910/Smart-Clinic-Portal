import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [departmentWiseDoctors, setDepartmentWiseDoctors] = useState({});

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/doctors", {
        headers: { Authorization: token },
      });

      const data = response.data;

      const grouped = {};
      data.forEach((doc) => {
        if (!grouped[doc.department]) {
          grouped[doc.department] = [];
        }
        grouped[doc.department].push(doc);
      });

      // Sort within departments: approved first
      for (let dept in grouped) {
        grouped[dept].sort((a, b) => b.isApproved - a.isApproved);
      }

      setDoctors(data);
      setDepartmentWiseDoctors(grouped);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const toggleApproval = async (doctorId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint = currentStatus
        ? `http://localhost:5000/api/doctors/disapprove/${doctorId}`
        : `http://localhost:5000/api/doctors/approve/${doctorId}`;

      await axios.put(endpoint, {}, { headers: { Authorization: token } });

      fetchDoctors(); // Refresh
    } catch (error) {
      console.error("Error updating doctor status:", error);
    }
  };

  const total = doctors.length;
  const approved = doctors.filter((d) => d.isApproved).length;
  const disapproved = total - approved;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-white text-center mb-8">Admin Dashboard</h1>
  
      {/* Doctor Counts */}
      <div className="flex flex-col md:flex-row justify-around mb-6 text-white font-semibold">
        <div className="bg-blue-600 rounded-lg px-6 py-3 shadow-md mb-2 md:mb-0">
          Total Doctors: {total}
        </div>
        <div className="bg-green-600 rounded-lg px-6 py-3 shadow-md mb-2 md:mb-0">
          Approved: {approved}
        </div>
        <div className="bg-red-600 rounded-lg px-6 py-3 shadow-md">
          Pending/Disapproved: {disapproved}
        </div>
      </div>
  
      {/* Registered Doctors by Department */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 border-b pb-2">Registered Doctors</h2>
  
        {Object.entries(departmentWiseDoctors).map(([department, docs]) => (
          <div key={department} className="mb-8">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">{department}</h3>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {docs.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-blue-50 p-4 rounded-lg shadow-md border border-blue-300"
                >
                  <div className="mb-3">
                    <h4 className="text-lg font-bold text-blue-700">{doctor.name}</h4>
                    <p className="text-gray-700">Email: {doctor.email}</p>
                    <p className="text-gray-700">Phone: {doctor.phone}</p>
                    <p className="text-gray-700">Reg. No: {doctor.registrationNumber}</p>
                    <p className="text-gray-700">Experience: {doctor.experience} years</p>
                    <p className="text-gray-700">Specialization: {doctor.specialization}</p>
                    <p className="text-gray-700">Education: {doctor.education}</p>
                  </div>
  
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        doctor.isApproved ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {doctor.isApproved ? "Approved" : "Pending"}
                    </span>
  
                    <button
                      onClick={() => toggleApproval(doctor._id, doctor.isApproved)}
                      className={`px-4 py-2 rounded text-white transition ${
                        doctor.isApproved
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {doctor.isApproved ? "Disapprove" : "Approve"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}  