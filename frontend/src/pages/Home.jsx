import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 p-6">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md py-4 px-6 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-3xl font-extrabold tracking-wide text-gray-900">
          HESOYAM Health
        </h1>
        <div>
          <Link
            to="/login"
            className="mx-3 text-gray-700 hover:text-blue-500 transition-all"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="ml-3 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-500 transition-all transform hover:scale-105"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-24 bg-gradient-to-r from-blue-200 via-white to-blue-100 rounded-b-[50px] shadow-lg">
        <h2 className="text-6xl font-extrabold tracking-wide text-gray-900 drop-shadow-md">
          HESOYAM : Shape the Future of Health
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          Innovating healthcare with seamless digital experiences.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-block bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:bg-blue-600 transition-all transform hover:scale-110"
        >
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6">
        <h3 className="text-4xl font-extrabold text-center text-gray-900">
          Why Choose HESOYAM?
        </h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center border border-gray-200 hover:shadow-xl transition">
            <h4 className="text-2xl font-semibold text-gray-900">
              Instant Appointments
            </h4>
            <p className="mt-2 text-gray-600">
              Schedule visits or telehealth consultations effortlessly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center border border-gray-200 hover:shadow-xl transition">
            <h4 className="text-2xl font-semibold text-gray-900">
              Secure Medical Records
            </h4>
            <p className="mt-2 text-gray-600">
              Access prescriptions and test reports anytime.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center border border-gray-200 hover:shadow-xl transition">
            <h4 className="text-2xl font-semibold text-gray-900">
              24/7 Healthcare Support
            </h4>
            <p className="mt-2 text-gray-600">
              Get medical assistance anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md text-gray-700 py-6 text-center border-t border-gray-200">
        <p>&copy; 2025 Hesoyam Health. All Rights Reserved.</p>
      </footer>
    </div>
  );
}