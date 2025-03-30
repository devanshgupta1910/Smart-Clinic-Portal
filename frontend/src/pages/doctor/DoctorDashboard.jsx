import { useEffect, useState } from "react";  
import { FaUserCircle, FaUser } from "react-icons/fa";  
import { useNavigate } from "react-router-dom";  
import axios from "axios";  
import { jwtDecode } from "jwt-decode";  

export default function DoctorDashboard() {  
  const navigate = useNavigate();  
  const [doctor, setDoctor] = useState(null);  
  const [schedule, setSchedule] = useState({});  
  const [appointments, setAppointments] = useState([]);  
  const [showDropdown, setShowDropdown] = useState(false);  

  useEffect(() => {  
    const token = localStorage.getItem("token");  
    if (!token) {  
      navigate("/login");  
      return;  
    }  

    fetchDoctor(token);  
    fetchAppointments(token);  
  }, [navigate]);  

  const fetchDoctor = async (token) => {  
    try {  
      let myId = jwtDecode(token).id;  
      const response = await axios.get(`http://localhost:5000/api/doctors/details/${myId}`, {  
        headers: { Authorization: token }  
      });  
      setDoctor(response.data);  
      
      // Ensure schedule is set correctly
      if (response.data.availability) {  
        setSchedule(response.data.availability);  
      } else {  
        console.error("Invalid availability data:", response.data.availability);
        setSchedule({
          Monday: "000000000000000000000000",
          Tuesday: "000000000000000000000000",
          Wednesday: "000000000000000000000000",
          Thursday: "000000000000000000000000",
          Friday: "000000000000000000000000",
          Saturday: "000000000000000000000000",
          Sunday: "000000000000000000000000"
        });
      }  
    } catch (error) {  
      console.error("Error fetching doctor details:", error);  
      navigate("/login");  
    }  
  };  

  const fetchAppointments = async (token) => {  
    try {  
      const response = await axios.get("http://localhost:5000/api/doctors/appointments", {  
        headers: { Authorization: token }  
      });  
      setAppointments(response.data);  
    } catch (error) {  
      console.error("Error fetching appointments:", error);  
    }  
  };  

  const toggleSlot = (dayName, hourIndex) => {  
    setSchedule((prevSchedule) => {
      if (!prevSchedule[dayName]) {
        console.error("Invalid day:", dayName);
        return prevSchedule;
      }

      const updatedDay = prevSchedule[dayName]
        .split("")
        .map((bit, i) => (i === hourIndex ? (bit === "0" ? "1" : "0") : bit))
        .join("");

      return { ...prevSchedule, [dayName]: updatedDay };
    });
  };

  const saveSchedule = async () => {  
    try {  
      const token = localStorage.getItem("token");
      if (!token) {  
        navigate("/login");  
        return;  
      }  
      const myId = jwtDecode(token).id;

      await axios.patch(`http://localhost:5000/api/doctors/update/${myId}`, { availability: schedule }, {  
          headers: { Authorization: token }  
      });  
      
      alert("Schedule updated successfully!");  
    } catch (error) {  
        console.error("Error saving schedule:", error);  
    }  
  };  

  const handleLogout = () => {  
    localStorage.removeItem("token");  
    navigate("/login");  
  };  

  const renderScheduleGrid = () => {  
    return (  
      <div className="grid grid-cols-8 gap-1 text-sm">  
        <div className="font-bold text-center"></div>  
        {Object.keys(schedule).map((day) => (  
          <div key={day} className="font-bold text-center">{day}</div>  
        ))}  
        {Array.from({ length: 24 }, (_, hour) => (  
          <div className="contents" key={`hour-${hour}`}>  
            <div className="font-semibold text-center">{hour}:00</div>  
            {Object.keys(schedule).map((day) => (  
              <button  
                key={`slot-${day}-${hour}`}  
                className={`w-10 h-10 border rounded transition duration-200   
                  ${  
                    schedule[day]?.[hour] === "1"  
                      ? "bg-green-500 cursor-pointer"  
                      : "bg-gray-200 hover:bg-green-200 cursor-pointer"  
                  }`}  
                onClick={() => toggleSlot(day, hour)}  
              >  
                {schedule[day]?.[hour] === "0" && (  
                  <span className="absolute -top-2 -right-2 opacity-0 transition-opacity duration-200 hover:opacity-100">  
                    ➤  
                  </span>  
                )}  
              </button>  
            ))}  
          </div>  
        ))}  
      </div>  
    );  
  };  

  return (  
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">  
      <div className="bg-white p-4 rounded-lg shadow-md w-2/3 max-h-[80vh] overflow-y-auto">  
        <h3 className="text-xl font-semibold mb-4">Manage Availability</h3>  
        {renderScheduleGrid()}  
        <button  
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"  
          onClick={saveSchedule}  
        >  
          Save Schedule  
        </button>  
      </div>  

      <div className="w-1/3 max-h-[80vh] overflow-y-auto">  
        <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg mb-6">  
          <h2 className="text-2xl font-bold text-gray-700">Doctor Dashboard</h2>  
          <div className="relative">  
            <FaUserCircle  
              className="text-3xl text-gray-700 cursor-pointer"  
              onClick={() => setShowDropdown(!showDropdown)}  
            />  
            {showDropdown && (  
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-2 z-10">  
                <button onClick={() => navigate("/doctor/profile")} className="block w-full text-left p-2 hover:bg-gray-200">  
                  Profile  
                </button>  
                <button onClick={handleLogout} className="block w-full text-left p-2 hover:bg-gray-200">  
                  Logout  
                </button>  
              </div>  
            )}  
          </div>  
        </div>  

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">  
          <h3 className="text-xl font-semibold mb-4">Doctor Details</h3>  
          {doctor ? (  
            <div>  
              <p><strong>Name:</strong> {doctor.name}</p>  
              <p><strong>Specialization:</strong> {doctor.specialization}</p>  
              <p><strong>Email:</strong> {doctor.email}</p>  
            </div>  
          ) : (  
            <p className="text-gray-500">Loading doctor details...</p>  
          )}  
        </div>  

        <div className="bg-white p-4 rounded-lg shadow-md">  
          <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>  
          {appointments.length === 0 ? (  
            <p className="text-gray-500">No upcoming appointments.</p>  
          ) : (  
            <div className="space-y-4">  
              {appointments.map((appointment) => (  
                <div key={appointment._id} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">   
                  <div>  
                    <h4 className="text-lg font-semibold flex items-center">  
                      <FaUser className="text-blue-500 mr-2" /> {appointment.patient}  
                    </h4>  
                    <p><strong>Time:</strong> {appointment.time}</p>  
                    <p><strong>Date:</strong> {appointment.date}</p>  
                  </div>  
                </div>  
              ))}  
            </div>  
          )}  
        </div>  
      </div>  
    </div>  
  );  
}
