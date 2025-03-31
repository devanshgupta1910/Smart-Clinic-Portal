import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaEnvelope, FaPhone, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PatientProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile_number: "",
    dob: "",
  });
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile(token);
  }, [navigate]);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: token },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/users/update", user, {
        headers: { Authorization: token },
      });
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg relative">
      {/* Back Arrow */}
      <button onClick={() => navigate("/patient/dashboard")} className="absolute top-4 left-4 text-gray-600 hover:text-gray-900">
        <FaArrowLeft className="text-2xl" />
      </button>

      <h2 className="text-2xl font-bold text-center mb-4">Patient Profile</h2>
      <div className="flex flex-col items-center mb-4">
        <FaUserCircle className="text-gray-600 text-6xl" />
      </div>

      <div className="space-y-4">
        {["name", "email", "mobile_number", "dob"].map((field, index) => (
          <div key={index} className="flex items-center border-b pb-2">
            <span className="mr-2 text-gray-500">
              {field === "email" ? <FaEnvelope /> : field === "mobile_number" ? <FaPhone /> : <FaCalendarAlt />}
            </span>
            {editMode ? (
              <input
                type={field === "dob" ? "date" : "text"}
                className="w-full border p-2 rounded"
                value={user[field]}
                onChange={(e) => setUser({ ...user, [field]: e.target.value })}
              />
            ) : (
              <p className="w-full">{user[field]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        {editMode ? (
          <>
            <button onClick={updateProfile} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)} className="bg-green-500 text-white px-4 py-2 rounded w-full">Edit Profile</button>
        )}
      </div>
    </div>
  );
}
