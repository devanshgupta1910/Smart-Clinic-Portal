import { useNavigate } from "react-router-dom";
import { FaUserMd, FaUser } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 p-6">
      <div className="backdrop-blur-xl bg-white/80 p-8 rounded-3xl shadow-2xl w-[400px] border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6 tracking-wide">
          Register as
        </h2>

        {/* Patient Registration Button */}
        <button
          onClick={() => navigate("/register/patient")}
          className="w-full flex items-center justify-center bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition-all transform hover:scale-105 mb-4"
        >
          <FaUser className="mr-2 text-xl" /> Register as Patient
        </button>

        {/* Doctor Registration Button */}
        <button
          onClick={() => navigate("/register/doctor")}
          className="w-full flex items-center justify-center bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-500 transition-all transform hover:scale-105"
        >
          <FaUserMd className="mr-2 text-xl" /> Register as Doctor
        </button>

        {/* Login Link */}
        <p className="text-gray-700 text-sm mt-6 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
