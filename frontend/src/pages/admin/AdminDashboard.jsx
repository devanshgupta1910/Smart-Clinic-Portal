import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="mt-4">
        <Link to="/admin/doctors" className="block bg-blue-500 text-white p-2 rounded my-2">
          Manage Doctors
        </Link>
      </div>
    </div>
  );
}
