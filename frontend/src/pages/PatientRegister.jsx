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
        //alert("Patient registered successfully!");
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-2xl w-96 border border-white/30">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
          Patient Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:border-yellow-300 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <input
              type="tel"
              name="mobile_number"
              placeholder="Mobile Number"
              pattern="[0-9]{10}"
              className="w-full p-3 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:border-yellow-300 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-3 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:border-yellow-300 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:border-yellow-300 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <input
              type="date"
              name="dob"
              className="w-full p-3 bg-transparent border-b-2 border-white text-white focus:outline-none focus:border-yellow-300 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <button className="w-full bg-yellow-400 text-gray-900 font-bold p-3 rounded-full shadow-lg hover:bg-yellow-300 transition-all transform hover:scale-105">
            Register as Patient
          </button>
        </form>
      </div>
    </div>
  );
}
