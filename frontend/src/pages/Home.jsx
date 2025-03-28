import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white">
      {/* Navbar */}
      <nav className="backdrop-blur-md bg-white/20 py-4 px-6 flex justify-between items-center shadow-lg rounded-b-2xl border border-white/30">
        <h1 className="text-2xl font-extrabold tracking-wide">Smart Clinic</h1>
        <div>
          <Link to="/login" className="mx-3 text-white hover:text-yellow-300 transition-all">
            Login
          </Link>
          <Link
            to="/register"
            className="ml-3 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-24">
        <h2 className="text-5xl font-extrabold tracking-wide drop-shadow-lg">
          Your Health, Our Priority
        </h2>
        <p className="mt-4 text-lg opacity-90">
          Book appointments, consult online, and manage medical records easily.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-300 transition-all transform hover:scale-105"
        >
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6">
        <h3 className="text-3xl font-extrabold text-center">Why Choose Smart Clinic?</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="backdrop-blur-md bg-white/20 p-6 rounded-2xl shadow-lg text-center border border-white/30">
            <h4 className="text-xl font-semibold">Easy Appointments</h4>
            <p className="mt-2 opacity-90">
              Book doctor visits or online consultations instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="backdrop-blur-md bg-white/20 p-6 rounded-2xl shadow-lg text-center border border-white/30">
            <h4 className="text-xl font-semibold">Medical Records</h4>
            <p className="mt-2 opacity-90">
              Securely store and access prescriptions and test reports.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="backdrop-blur-md bg-white/20 p-6 rounded-2xl shadow-lg text-center border border-white/30">
            <h4 className="text-xl font-semibold">24/7 Support</h4>
            <p className="mt-2 opacity-90">
              Get medical help anytime, anywhere with our online support.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="backdrop-blur-md bg-white/20 text-white py-6 text-center border-t border-white/30">
        <p>&copy; 2025 Smart Clinic. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
