import { useState } from "react";

export default function DoctorRegister() {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    phone: "",
  });

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/register/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      });

      if (response.ok) {
        alert("Doctor registered successfully! Waiting for admin approval.");
      } else {
        alert("Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
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
          <input type="text" name="name" placeholder="Full Name" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="text" name="specialization" placeholder="Specialization" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="number" name="experience" placeholder="Experience (Years)" className="w-full p-2 border rounded" onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone Number" className="w-full p-2 border rounded" onChange={handleChange} required />

          <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Register as Doctor
          </button>
        </form>
      </div>
    </div>
  );
}
