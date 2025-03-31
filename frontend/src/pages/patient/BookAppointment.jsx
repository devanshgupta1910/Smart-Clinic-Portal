import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function BookAppointmentPopup({ doctorId, closePopup, onBookingSuccess }) {
  const [schedule, setSchedule] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("");

  useEffect(() => {
    if (date) {
      updateDayName(date);
    }
  }, [date]);

  useEffect(() => {
    if (doctorId && date && dayName) {
      fetchDoctorSchedule();
    }
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

    if (!date) {
      alert("Please select a date first!");
      return;
    }

    if (date === today) {
      alert("Appointments can only be booked from the next day onwards.");
      return;
    }

    setSelectedSlot({ day: dayName, time });
  };

  const handleConfirmAndPay = async () => {
    if (!selectedSlot) return;

    try {
      const token = localStorage.getItem("token");
      const patientId = jwtDecode(token).id;
      await axios.post(
        "http://localhost:5000/api/appointments/book",
        {
          doctorId,
          patientId,
          date,
          time: selectedSlot.time,
        },
        { headers: { Authorization: token } }
      );

      alert("Appointment booked successfully!");
      closePopup();
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl relative">
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
        >
          ✖
        </button>

        <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>

        <input
          type="date"
          className="p-2 border rounded w-full mb-3"
          value={date}
          min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Ensures the earliest selectable date is tomorrow
          onChange={(e) => setDate(e.target.value)}
        />

        {date && schedule.includes("1") && (
          <div>
            <h2 className="text-lg font-bold mb-2">{dayName} Slots</h2>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 24 }, (_, hour) => {
                const isAvailable = schedule.charAt(hour) === "1";
                const isSelected = selectedSlot?.time === hour;

                return (
                  <button
                    key={`slot-${hour}`}
                    className={`p-2 border rounded text-center transition-all ${
                      isAvailable
                        ? isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-green-500 hover:bg-green-600 cursor-pointer"
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
              <div className="mt-4 text-center">
                <button
                  onClick={handleConfirmAndPay}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
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
