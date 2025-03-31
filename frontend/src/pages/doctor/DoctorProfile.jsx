import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserMd } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function DoctorProfile() {
  const [profile, setProfile] = useState({
    name: "",
    mobile_number: "",
    email: "",
    specialization: "",
    experience: "",
    clinic_address: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
      const token = localStorage.getItem("token");
      let doctorId = jwtDecode(token).id;
      const response = await axios.get(`http://localhost:5000/api/doctors/details/${doctorId}`, {
        headers: { Authorization: token },
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/doctors/profile", profile, {
        headers: { Authorization: token },
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md p-6 rounded-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 flex items-center">
          <FaUserMd className="mr-2" /> Doctor Profile
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block text-gray-700">Mobile Number</label>
            <input
              type="text"
              name="mobile_number"
              value={profile.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              disabled
              className="w-full border p-2 rounded mb-3 bg-gray-200 cursor-not-allowed"
            />

            <label className="block text-gray-700">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={profile.specialization}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded mb-3"
            />

            {isEditing ? (
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Save Changes
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Edit Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
