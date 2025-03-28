import { useNavigate } from "react-router-dom";
import { FaUserMd, FaUser } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="backdrop-blur-md bg-white/20 p-8 rounded-2xl shadow-2xl w-96 border border-white/30">
        <h2 className="text-3xl font-extrabold text-center text-white mb-6 tracking-wide">
          Register as
        </h2>

        {/* Patient Registration Button */}
        <button
          onClick={() => navigate("/register/patient")}
          className="w-full flex items-center justify-center bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-400 transition-all transform hover:scale-105 mb-4"
        >
          <FaUser className="mr-2 text-xl" /> Register as Patient
        </button>

        {/* Doctor Registration Button */}
        <button
          onClick={() => navigate("/register/doctor")}
          className="w-full flex items-center justify-center bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-400 transition-all transform hover:scale-105"
        >
          <FaUserMd className="mr-2 text-xl" /> Register as Doctor
        </button>

        {/* Login Link */}
        <p className="text-white text-sm mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-yellow-300 font-medium hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
