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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white px-6 py-10">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-8 relative">
        {/* Back Arrow */}
        <button onClick={() => navigate("/patient/dashboard")} className="absolute top-4 left-4 text-gray-500 hover:text-gray-900">
          <FaArrowLeft className="text-2xl" />
        </button>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Patient Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-gray-500 text-7xl" />
        </div>

        <div className="space-y-5">
          {["name", "email", "mobile_number", "dob"].map((field, index) => (
            <div key={index} className="flex items-center bg-gray-100 rounded-xl p-3">
              <span className="mr-3 text-gray-600">
                {field === "email" ? <FaEnvelope /> : field === "mobile_number" ? <FaPhone /> : <FaCalendarAlt />}
              </span>
              {editMode ? (
                <input
                  type={field === "dob" ? "date" : "text"}
                  className="w-full bg-transparent focus:outline-none text-gray-700"
                  value={user[field]}
                  onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                />
              ) : (
                <p className="w-full text-gray-800 font-medium">{user[field]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          {editMode ? (
            <>
              <button onClick={updateProfile} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl transition w-full mr-2">Save</button>
              <button onClick={() => setEditMode(false)} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-xl transition w-full ml-2">Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition w-full">Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}