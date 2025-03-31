import express from "express";
import moment from "moment";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", authMiddleware, async (req, res) => {
    try {
        const { doctorId, patientId, date, time } = req.body;
        const appointmentDate = new Date(date);
        const dayName = moment(appointmentDate).format("dddd"); // Get day name

        // Find the doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        // Check if the doctor is available on the selected day and time
        if (!doctor.availability[dayName]) {
            return res.status(400).json({ message: "Doctor is not available on this day" });
        }

        const availability = doctor.availability[dayName];
        if (!availability || availability.charAt(time) !== "1") {
            return res.status(400).json({ message: "Doctor is not available at this time slot" });
        }

        // Count existing appointments for this doctor, date, and time slot
        const appointmentCount = await Appointment.countDocuments({ 
            doctorId, 
            date: appointmentDate, 
            timeSlot: time 
        });

        if (appointmentCount >= 3) {
            return res.status(400).json({ message: "Time slot is fully booked" });
        }

        // Create the appointment
        const appointment = new Appointment({
            doctorId,
            patientId,
            date: appointmentDate,
            timeSlot: time,
            status: "pending",
        });

        await appointment.save();
        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get("/all", authMiddleware, async (req, res) => {
    try {
        let appointments;
        const { role } = req.user;
        if (role === "doctor") {
            // Fetch all appointments for the doctor
            appointments = await Appointment.find({
                doctorId: req.user.id
            }).populate("patientId", "name email");
        } else if (role === "patient") {
            // Fetch all appointments for the patient
            appointments = await Appointment.find({
                patientId: req.user.id
            }).populate("doctorId", "name email specialization");
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
