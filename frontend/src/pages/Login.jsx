import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaUser, FaUserShield } from "react-icons/fa";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient"); // Default role is Patient
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(`Logging in as ${role}...`);

    let api_role = "users";
    if(role == "doctor")
      api_role = "doctors";
    else if(role == "admin")
      api_role = "admin";

    // Redirect based on user role
    try {
      const response = await axios.post(`http://localhost:5000/api/${api_role}/login`, {
        email,
        password,
      });
  
      // ✅ Save Token (optional - if you want to keep user logged in)
      localStorage.setItem("token", response.data.token);
  
      // ✅ Navigate based on user role (from backend, not selected manually)
      const decodedToken = JSON.parse(atob(response.data.token.split(".")[1]));
      const userRole = decodedToken.role;
  
      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-2xl w-96 border border-white/30">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
          Login to Smart Clinic
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:border-yellow-300 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 bg-transparent border-b-2 border-white text-white placeholder-white focus:outline-none focus:border-yellow-300 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <div className="text-center">
            <label className="block text-white font-medium mb-2">Login As</label>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                className={`p-3 w-1/3 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                  role === "patient" ? "bg-blue-500 text-white" : "bg-white/30 text-white"
                }`}
                onClick={() => setRole("patient")}
              >
                <FaUser className="text-xl mb-1" />
                Patient
              </button>

              <button
                type="button"
                className={`p-3 w-1/3 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                  role === "doctor" ? "bg-green-500 text-white" : "bg-white/30 text-white"
                }`}
                onClick={() => setRole("doctor")}
              >
                <FaUserMd className="text-xl mb-1" />
                Doctor
              </button>

              <button
                type="button"
                className={`p-3 w-1/3 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                  role === "admin" ? "bg-red-500 text-white" : "bg-white/30 text-white"
                }`}
                onClick={() => setRole("admin")}
              >
                <FaUserShield className="text-xl mb-1" />
                Admin
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button className="w-full bg-yellow-400 text-gray-900 font-bold p-3 rounded-full shadow-lg hover:bg-yellow-300 transition-all transform hover:scale-105">
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-white text-center mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-yellow-300 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
