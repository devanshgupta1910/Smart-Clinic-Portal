import { useState } from "react";

export default function BookAppointment() {
  const [date, setDate] = useState("");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Book Appointment</h1>
      <input
        type="date"
        className="p-2 border rounded my-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 rounded mt-2">
        Confirm Appointment
      </button>
    </div>
  );
}
