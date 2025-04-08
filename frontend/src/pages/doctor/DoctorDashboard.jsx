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
  const [showUploadModal, setShowUploadModal] = useState({visible:false, appointmentId:null}); // Modal visibility state
  const [selectedFile, setSelectedFile] = useState(null); // State to hold the selected file
  const [diagnosis, setDiagnosis] = useState(""); // State to hold the diagnosis input
  const [additionalNotes, setAdditionalNotes] = useState(""); // State to hold the additional notes input

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
      
      if (response.data.availability) {  
        setSchedule(response.data.availability);  
      } else {  
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
      const response = await axios.get("http://localhost:5000/api/appointments/all", {  
        headers: { Authorization: token }  
      });  
      setAppointments(response.data);  
    } catch (error) {  
      console.error("Error fetching appointments:", error);  
    }  
  };  

  const markAppointmentCompleted = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.patch(`http://localhost:5000/api/appointments/update/${appointmentId}`, 
        { status: "completed" }, 
        { headers: { Authorization: token } }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: "completed" } : appointment
        )
      );

      alert("Appointment marked as completed!");
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const uploadPrescription = async (appointmentId) => {
    if (!selectedFile || !diagnosis || !additionalNotes) {
      alert("Please fill in all fields and select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("appointmentId", appointmentId);
    formData.append("prescriptionURL", selectedFile);
    formData.append("diagnosis", diagnosis);
    formData.append("additionalNotes", additionalNotes);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(`http://localhost:5000/api/prescriptions/submit`, 
        formData, 
        { headers: { Authorization: token, "Content-Type": "multipart/form-data" } }
      );

      alert("Prescription uploaded successfully!");
      setShowUploadModal({visible:false, appointmentId:null}); // Close modal after upload
    } catch (error) {
      console.error("Error uploading prescription:", error);
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
    <div className="w-full flex flex-col items-center"> 
      
      {/* Weekday Headers */}
      <div className="grid grid-cols-8 gap-4 w-fit mb-2">
        <div className="w-26"></div> {/* Placeholder for time column */}
        {Object.keys(schedule).map((day) => (
          <div
            key={day}
            className="font-bold text-center text-white bg-blue-500 p-3 rounded w-28 h-14 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-8 gap-4 w-fit">
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={`hour-${hour}`} className="contents">
            {/* Hour Column */}
            <div className="font-semibold text-center text-white bg-blue-500 p-3 rounded w-28 h-14 flex items-center justify-center">
              {hour}:00
            </div>

            {/* Slots for Each Day */}
            {Object.keys(schedule).map((day) => (
              <div key={`slot-container-${day}-${hour}`} className="flex justify-center items-center w-28 h-14">
                <button
                  key={`slot-${day}-${hour}`}
                  className={`w-14 h-14 border border-blue-400 rounded-lg transition duration-200 cursor-pointer
                    ${schedule[day]?.[hour] === "1"
                      ? "bg-green-500 hover:bg-green-400"
                      : "bg-blue-200 hover:bg-blue-300"} 
                  `}
                  onClick={() => toggleSlot(day, hour)}
                ></button>

              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
  return (  
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 p-6 flex flex-col gap-6 text-blue-900">  

      {/* Doctor Dashboard Header (Full Width) */}
      <div className="w-full bg-white shadow-lg p-4 rounded-lg flex justify-between items-center">  
        <h2 className="text-2xl font-bold">Doctor Dashboard</h2>  
        <div className="relative">  
          <FaUserCircle className="text-4xl text-blue-600 cursor-pointer hover:text-blue-900" onClick={() => setShowDropdown(!showDropdown)} />  
          {showDropdown && (  
            <div className="absolute right-0 mt-2 w-48 bg-blue-100 shadow-lg rounded-lg p-2 z-10">  
              <button onClick={() => navigate("/doctor/profile")} className="block w-full text-left p-2 hover:bg-blue-200">Profile</button>  
              <button onClick={handleLogout} className="block w-full text-left p-2 hover:bg-blue-200">Logout</button>  
            </div>  
          )}  
        </div>  
      </div>  

      {/* Two Sections Side-by-Side */}
      <div className="flex gap-6 w-full">
        
        {/* Manage Availability Section (Wider - 60%) */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-[60%] max-h-[80vh] overflow-y-auto">  
          <h3 className="text-xl font-semibold mb-4 border-b border-blue-300 pb-2">Manage Availability</h3>  
          {renderScheduleGrid()}  
          <div className="flex justify-center mt-4">
            <button  
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-500 transition"  
              onClick={saveSchedule}  
            >  
              Save Schedule  
            </button> 
          </div> 
        </div>  

        {/* Your Appointments Section (Narrower - 40%) */}
        <div className="bg-white p-5 rounded-lg shadow-lg w-[40%] max-h-[80vh] overflow-y-auto">  
          <h3 className="text-xl font-semibold mb-4 border-b border-blue-300 pb-2">Your Appointments</h3>  
          {[...appointments]
            .sort((a, b) => {
              const now = new Date();
              
              const getDateTime = (appt) => {
                const date = appt.date.split("T")[0];
                const hour = String(appt.timeSlot).padStart(2, "0");
                return new Date(`${date}T${hour}:00:00Z`);
              };

              const aTime = getDateTime(a);
              const bTime = getDateTime(b);

              const aIsPast = aTime < now;
              const bIsPast = bTime < now;

              // If one is future and one is past, put future one on top
              if (!aIsPast && bIsPast) return -1;
              if (aIsPast && !bIsPast) return 1;

              // If both are future, sort ascending
              if (!aIsPast && !bIsPast) return aTime - bTime;

              // If both are past, sort descending
              return bTime - aTime;
            })
            .map((appointment) => {
            const appointmentDate = appointment.date.split("T")[0];
            const formattedHour = String(appointment.timeSlot).padStart(2, "0");
            const appointmentDateTime = new Date(`${appointmentDate}T${formattedHour}:00:00Z`);
            const isPastAppointment = appointmentDateTime < new Date();
            return (
              <div key={appointment._id} className="bg-blue-100 p-4 rounded-lg shadow-md flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-lg font-semibold flex items-center"><FaUser className="text-blue-500 mr-2" /> {appointment.patient}</h4>
                  <p><strong>Date:</strong> {appointment.date.split("T")[0]}</p>
                  <p><strong>Time:</strong> {appointment.timeSlot}:00</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAppointmentCompleted(appointment._id)}
                    disabled={!isPastAppointment || appointment.status === "completed"}
                    className={`w-36 px-4 py-2 text-white rounded-md text-sm text-center
                      ${appointment.status === "completed" || !isPastAppointment ? "bg-blue-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-400"}
                    `}
                  >
                    {appointment.status === "completed" ? "Completed" : "Mark as Completed"}
                  </button>
                  <button
                    onClick={() => setShowUploadModal({visible:true, appointmentId:appointment._id})}
                    disabled={appointment.status === "completed"}
                    className={`w-36 px-4 py-2 text-white rounded-md text-sm text-center
                      ${!isPastAppointment ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-400"}
                    `}
                  > 
                    Upload Prescription
                  </button>
                </div>
              </div>
            );
          })}
        </div>  

      </div>

      {/* Modal for Uploading Prescription */}
      {showUploadModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-semibold mb-4">Upload Prescription</h2>
            <div className="mb-4">
              <label className="block mb-2">Select Prescription File</label>
              <input 
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files[0])} 
                className="border border-blue-300 p-2 w-full bg-blue-50 text-blue-900"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Diagnosis</label>
              <input 
                type="text" 
                value={diagnosis} 
                onChange={(e) => setDiagnosis(e.target.value)} 
                className="border border-blue-300 p-2 w-full bg-blue-50 text-blue-900"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Additional Notes</label>
              <textarea 
                value={additionalNotes} 
                onChange={(e) => setAdditionalNotes(e.target.value)} 
                className="border border-blue-300 p-2 w-full bg-blue-50 text-blue-900"
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button 
                onClick={() => setShowUploadModal({visible:false, appointmentId:null})} 
                className="px-4 py-2 bg-blue-300 text-blue-900 rounded-md hover:bg-blue-200"
              >
                Cancel
              </button>
              <button 
                onClick={() => uploadPrescription(showUploadModal.appointmentId)} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>  
  );


}