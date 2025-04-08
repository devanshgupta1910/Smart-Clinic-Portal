import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PatientRegister() {
  const [patient, setPatient] = useState({
    name: "",
    mobile_number: "",
    email: "",
    password: "",
    dob: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", patient);
      if (response.status === 201 || response.status === 200) {
        navigate("/patient/dashboard");
      } else {
        alert("Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Error registering patient.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[400px] border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Patient Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="mobile_number"
            placeholder="Mobile Number"
            pattern="[0-9]{10}"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dob"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
          <button className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg shadow-md hover:bg-blue-600 transition-all">
            Register as Patient
          </button>
        </form>
      </div>
    </div>
  );
}