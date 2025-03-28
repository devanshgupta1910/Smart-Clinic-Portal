import express from "express";
import {authMiddleware} from "../middleware/authMiddleware.js";
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";
import moment from "moment";

const router = express.Router();

router.post("/book", authMiddleware, async (req, res) => {
    try {
        const { doctorId, patiendId, date } = req.body;
        const appointmentDate = new Date(date); // Convert to Date object
        const time = moment(appointmentDate).format("HH:mm"); // Extract time in HH:mm format

        // Find the doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        // Find the selected date's availability
        const availabilityIndex = doctor.availability.findIndex(
            (slot) => moment(slot.date).format("YYYY-MM-DD") === moment(appointmentDate).format("YYYY-MM-DD")
        );
        if (availabilityIndex === -1) return res.status(400).json({ message: "No available slots for this date" });

        // Check if the slot exists
        const slotIndex = doctor.availability[availabilityIndex].slots.indexOf(time);
        if (slotIndex === -1) return res.status(400).json({ message: "Slot not available" });

        // Remove the booked slot
        doctor.availability[availabilityIndex].slots.splice(slotIndex, 1);

        // If no more slots are available for the day, remove the entire date entry
        if (doctor.availability[availabilityIndex].slots.length === 0) {
            doctor.availability.splice(availabilityIndex, 1);
        }

        // Save the updated doctor info
        await doctor.save();

        // Create the appointment
        const appointment = new Appointment({
            doctor: doctorId,
            patiendId,
            date: appointmentDate, // Full Date & Time stored
            time, // Extracted Time
            status: "pending",
        });

        await appointment.save();
        res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// router.get("/doctor/:doctorId/today", authMiddleware, async (req, res) => {
//     if (req.user.role !== "doctor" || req.user.id !== req.params.doctorId) {
//         return res.status(403).json({ message: "Access denied" });
//     }

//     try {
//         const today = new Date().setHours(0, 0, 0, 0);
//         const tomorrow = new Date(today).setDate(new Date(today).getDate() + 1);

//         const appointments = await Appointment.find({
//             doctorId: req.user.id,
//             date: { $gte: today, $lt: tomorrow }
//         }).populate("patientId", "name email");

//         res.json(appointments);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

export default router;
