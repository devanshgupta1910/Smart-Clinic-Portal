import { useEffect, useState } from "react";
import axios from "axios";

export default function BookAppointmentPopup({ doctorId, closePopup, onBookingSuccess }) {
  const [schedule, setSchedule] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("");

  // Update dayName when date changes
  useEffect(() => {
    if (date) {
      updateDayName(date);
    }
  }, [date]);

  // Fetch schedule after doctorId, date, and dayName are available
  useEffect(() => {
    if (doctorId && date && dayName) {
      fetchDoctorSchedule();
    }
  }, [doctorId, date, dayName]);

  // Fetch Doctor Schedule from API
  const fetchDoctorSchedule = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/doctors/details/${doctorId}?date=${date}`,
        {
          headers: { Authorization: token },
        }
      );

      console.log("Fetched schedule:", response.data);
      setSchedule(response.data.availability || {});
    } catch (error) {
      console.error("Error fetching doctor schedule:", error);
    }
  };

  // Convert selected date to day name (e.g., "Monday")
  const updateDayName = (selectedDate) => {
    const day = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
    setDayName(day);
  };

  // Handle slot selection
  const handleSlotSelection = (time) => {
    if (!date) {
      alert("Please select a date first!");
      return;
    }
    setSelectedSlot({ day: dayName, time });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
        >
          ✖
        </button>

        <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>

        {/* Date Selection */}
        <input
          type="date"
          className="p-2 border rounded w-full mb-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Slots Display */}
        {date && dayName && schedule[dayName] ? (
          <div>
            <h2 className="text-lg font-bold mb-2">{dayName} Slots</h2>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 24 }, (_, hour) => {
                const isAvailable = schedule[dayName] && schedule[dayName].charAt(hour) === "1";
                const isSelected = selectedSlot?.time === hour;

                return (
                  <button
                    key={`slot-${hour}`}
                    className={`p-2 border rounded text-center transition-all ${
                      isAvailable
                        ? isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-green-500 hover:bg-green-600 cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && handleSlotSelection(hour)}
                  >
                    {isAvailable ? (isSelected ? "✔" : `${hour}:00`) : ""}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          date && <p className="text-red-500 mt-3">No slots available for this date.</p>
        )}
      </div>
    </div>
  );
}
