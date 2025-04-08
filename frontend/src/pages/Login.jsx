import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaUser, FaUserShield } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(`Logging in as ${role}...`);

    let api_role = "users";
    if (role === "doctor") api_role = "doctors";
    else if (role === "admin") api_role = "admin";

    try {
      const response = await axios.post(
        `http://localhost:5000/api/${api_role}/login`,
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      console.log(jwtDecode(response.data.token));

      navigate(`/${role}/dashboard`);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 p-6">
      <div className="backdrop-blur-xl bg-white/80 p-8 rounded-3xl shadow-2xl w-[400px] border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6 tracking-wide">
          Login to Hesoyam
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-white/70 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-3 bg-white/70 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <div className="text-center">
            <label className="block text-gray-800 font-medium mb-3">
              Login As
            </label>
            <div className="flex justify-between mt-2 gap-3">
              <button
                type="button"
                className={`p-3 w-1/3 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                  role === "patient"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border border-gray-300"
                }`}
                onClick={() => setRole("patient")}
              >
                <FaUser className="text-xl mb-1" />
                Patient
              </button>

              <button
                type="button"
                className={`p-3 w-1/3 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                  role === "doctor"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-800 border border-gray-300"
                }`}
                onClick={() => setRole("doctor")}
              >
                <FaUserMd className="text-xl mb-1" />
                Doctor
              </button>

              <button
                type="button"
                className={`p-3 w-1/3 rounded-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 ${
                  role === "admin"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-800 border border-gray-300"
                }`}
                onClick={() => setRole("admin")}
              >
                <FaUserShield className="text-xl mb-1" />
                Admin
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button className="w-full bg-blue-600 text-white font-bold p-3 rounded-full shadow-lg hover:bg-blue-500 transition-all transform hover:scale-105">
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-gray-700 text-center mt-4">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
