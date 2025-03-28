import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const departmentOptions = [
  { value: "Cardiology", label: "Cardiology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Orthopedics", label: "Orthopedics" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Gynecology", label: "Gynecology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Radiology", label: "Radiology" },
  { value: "Oncology", label: "Oncology" },
  { value: "Urology", label: "Urology" },
  { value: "Gastroenterology", label: "Gastroenterology" },
  { value: "Psychiatry", label: "Psychiatry" },
  { value: "ENT", label: "ENT" },
  { value: "Ophthalmology", label: "Ophthalmology" },
  { value: "Nephrology", label: "Nephrology" },
  { value: "Pulmonology", label: "Pulmonology" },
  { value: "Anesthesiology", label: "Anesthesiology" },
  { value: "Endocrinology", label: "Endocrinology" },
  { value: "Rheumatology", label: "Rheumatology" },
  { value: "General Medicine", label: "General Medicine" },
  { value: "General Surgery", label: "General Surgery" },
];

export default function DoctorRegister() {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    specialization: "",
    experience: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (selectedOption) => {
    setDoctor({ ...doctor, department: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/doctors/register",
        doctor
      );

      if (response.status === 201 || response.status === 200) {
        navigate("/doctor/dashboard");
      } else {
        alert("Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Error registering doctor.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Doctor Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <Select
            options={departmentOptions}
            onChange={handleDepartmentChange}
            placeholder="Select Department"
            isSearchable
            className="w-full"
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="experience"
            placeholder="Experience (Years)"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />

          <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Register as Doctor
          </button>
        </form>
      </div>
    </div>
  );
}
