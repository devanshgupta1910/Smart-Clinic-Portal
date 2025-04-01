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
          appointment._id === appointmentId ? { ...appointment, status: "Completed" } : appointment
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
    formData.append("prescriptionFile", selectedFile);
    formData.append("diagnosis", diagnosis);
    formData.append("additionalNotes", additionalNotes);

    try {
      console.log("hi");
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
                  ${schedule[day]?.[hour] === "1" ? "bg-green-500 cursor-pointer" : "bg-gray-200 hover:bg-green-200 cursor-pointer"}`}  
                onClick={() => toggleSlot(day, hour)}  
              >  
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
            <FaUserCircle className="text-3xl text-gray-700 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)} />  
            {showDropdown && (  
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg p-2 z-10">  
                <button onClick={() => navigate("/doctor/profile")} className="block w-full text-left p-2 hover:bg-gray-200">Profile</button>  
                <button onClick={handleLogout} className="block w-full text-left p-2 hover:bg-gray-200">Logout</button>  
              </div>  
            )}  
          </div>  
        </div>  

        <div className="bg-white p-4 rounded-lg shadow-md">  
          <h3 className="text-xl font-semibold mb-4">Your Appointments</h3>  
          {appointments.map((appointment) => {
            const appointmentDate = appointment.date.split("T")[0];
            const formattedHour = String(appointment.timeSlot).padStart(2, "0");
            const appointmentDateTime = new Date(`${appointmentDate}T${formattedHour}:00:00Z`);
            const isPastAppointment = appointmentDateTime < new Date();
            return (
              <div key={appointment._id} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold flex items-center"><FaUser className="text-blue-500 mr-2" /> {appointment.patient}</h4>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Date:</strong> {appointment.date}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAppointmentCompleted(appointment._id)}
                    disabled={!isPastAppointment || appointment.status === "completed"}
                    className={`px-4 py-2 text-white rounded ${appointment.status === "completed" || !isPastAppointment ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                  >
                    {appointment.status === "completed" ? "Completed" : "Mark as Completed"}
                  </button>
                  <button
                    onClick={() => setShowUploadModal({visible:true, appointmentId:appointment._id})}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  > 
                    Upload Prescription
                  </button>
                </div>
              </div>
            );
          })}
        </div>  
      </div>  

      {/* Modal for uploading prescription */}
      {showUploadModal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Upload Prescription</h2>
            <div className="mb-4">
              <label className="block mb-2">Select Prescription File</label>
              <input 
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files[0])} 
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Diagnosis</label>
              <input 
                type="text" 
                value={diagnosis} 
                onChange={(e) => setDiagnosis(e.target.value)} 
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Additional Notes</label>
              <textarea 
                value={additionalNotes} 
                onChange={(e) => setAdditionalNotes(e.target.value)} 
                className="border p-2 w-full"
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button 
                onClick={() => setShowUploadModal({visible:false, appointmentId:null})} 
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                onClick={() => uploadPrescription(showUploadModal.appointmentId)} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
