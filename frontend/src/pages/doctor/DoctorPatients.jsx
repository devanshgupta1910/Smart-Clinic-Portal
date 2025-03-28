import { useState } from "react";

export default function DoctorPatients() {
  const [patients, setPatients] = useState([
    { id: 1, name: "John Doe", status: "Ongoing Treatment" },
    { id: 2, name: "Jane Smith", status: "Recovered" },
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Doctor's Patients</h1>
      <ul className="mt-4">
        {patients.map((patient) => (
          <li key={patient.id} className="border p-2 my-2">
            <span className="font-bold">{patient.name}</span> - {patient.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
