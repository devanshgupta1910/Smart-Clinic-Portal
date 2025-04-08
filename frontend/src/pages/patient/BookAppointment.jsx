import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function BookAppointmentPopup({ doctorId, closePopup }) {
  const [schedule, setSchedule] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("");

  useEffect(() => {
    if (date) updateDayName(date);
  }, [date]);

  useEffect(() => {
    if (doctorId && date && dayName) fetchDoctorSchedule();
  }, [doctorId, date, dayName]);

  const fetchDoctorSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/doctors/details/${doctorId}?date=${date}`,
        { headers: { Authorization: token } }
      );
      setSchedule(response.data.availableSlots || "000000000000000000000000");
    } catch (error) {
      console.error("Error fetching doctor schedule:", error);
    }
  };

  const updateDayName = (selectedDate) => {
    const day = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
    setDayName(day);
  };

  const handleSlotSelection = (time) => {
    const today = new Date().toISOString().split("T")[0];
    if (!date) return alert("Please select a date first!");
    if (date === today) return alert("Appointments can only be booked from the next day onwards.");
    setSelectedSlot({ day: dayName, time });
  };

  const handleConfirmAndPay = async () => {
    if (!selectedSlot) return;
    try {
      const token = localStorage.getItem("token");
      const patientId = jwtDecode(token).id;
      await axios.post("http://localhost:5000/api/appointments/book", {
        doctorId,
        patientId,
        date,
        time: selectedSlot.time,
      }, { headers: { Authorization: token } });
      alert("Appointment booked successfully!");
      closePopup();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-100 bg-opacity-70 backdrop-blur-lg z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
        <button onClick={closePopup} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl">✖</button>
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Book Appointment</h1>
        
        <input
          type="date"
          className="p-3 border rounded-lg w-full mb-4 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
          value={date}
          min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />
        
        {date && schedule.includes("1") && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{dayName} Slots</h2>
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 24 }, (_, hour) => {
                const isAvailable = schedule.charAt(hour) === "1";
                const isSelected = selectedSlot?.time === hour;
                return (
                  <button
                    key={`slot-${hour}`}
                    className={`p-3 rounded-lg text-center font-semibold transition-all ${
                      isAvailable
                        ? isSelected
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-500 hover:text-white"
                        : "hidden"
                    }`}
                    onClick={() => isAvailable && handleSlotSelection(hour)}
                  >
                    {isAvailable ? (isSelected ? "✔" : `${hour}:00`) : ""}
                  </button>
                );
              })}
            </div>
            {selectedSlot && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleConfirmAndPay}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-md transition-all"
                >
                  Confirm & Pay
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}