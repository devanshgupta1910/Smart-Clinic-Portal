import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctorModel.js";
import Appointment from "../models/appointmentModel.js";
import dotenv from "dotenv";
import { authMiddleware, adminMiddleware, doctorMiddleware } from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

// Register a New Doctor
router.post("/register", async (req, res) => {
    const { name, email, password, department, specialization, experience, phone, availability } = req.body;
    try {
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) return res.status(400).json({ message: "Doctor already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const doctor = await Doctor.create({
            name,
            email,
            password: hashedPassword,
            department,
            specialization,
            experience,
            phone,
            availability,
        });

        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Doctor Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) return res.status(401).json({ message: "Doctor not found" });

        const validPassword = await bcrypt.compare(password, doctor.password);
        if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: doctor._id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all doctors (Admin Only)
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find(); // Fetch all doctors (admin access only)
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// // ✅ Get logged-in doctor's details
// router.get("/details/:id", authMiddleware, async (req, res) => {
//     try {
//         const { role } = req.user; // Extract user role from token
//         let doctor;

//         if (role === "doctor" || role === "admin") {
//             // Doctors & Admins get full details (excluding password)
//             doctor = await Doctor.findById(req.params.id).select("-password");
//         } else {
//             // Patients get only selected details
//             doctor = await Doctor.findById(req.params.id).select("name specialization experience availability");

//         }

//         if (!doctor) return res.status(404).json({ message: "Doctor not found" });

//         res.json(doctor);
//     } catch (error) {
//         console.error("Error fetching doctor:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });


router.get("/details/:id", authMiddleware, async (req, res) => {
    try {
        const { role } = req.user; // Extract user role from token
        const { date } = req.query; // Get the selected date from query params

        let doctor;
        if (role === "doctor" || role === "admin") {
            doctor = await Doctor.findById(req.params.id).select("-password");
        } else {
            doctor = await Doctor.findById(req.params.id).select("name specialization experience availability");
        }

        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        if (date) {
            // Convert the date to a weekday (e.g., "Monday")
            const selectedDay = new Date(date).toLocaleString("en-us", { weekday: "long" });
            let availableSlots = doctor.availability[selectedDay]; 

            if (!availableSlots) {
                return res.json({
                    name: doctor.name,
                    specialization: doctor.specialization,
                    experience: doctor.experience,
                    availableSlots: "000000000000000000000000" // Default unavailable slots
                });
            }

            // Convert availableSlots (string) to an array for easier modification
            availableSlots = availableSlots.split("");

            // Check appointment counts for each slot
            for (let hour = 0; hour < 24; hour++) {
                if (availableSlots[hour] === "1") {
                    const appointmentCount = await Appointment.countDocuments({
                        doctorId: req.params.id,
                        date: new Date(date),
                        timeSlot: hour,
                    });

                    // If the slot is fully booked (3 appointments), mark it as unavailable
                    if (appointmentCount >= 3) {
                        availableSlots[hour] = "0";
                    }
                }
            }

            return res.json({
                name: doctor.name,
                specialization: doctor.specialization,
                experience: doctor.experience,
                availableSlots: availableSlots.join(""), // Convert back to string
            });
        }

        res.json(doctor);
    } catch (error) {
        console.error("Error fetching doctor:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// ✅ Get only approved doctors (Patients can see this)
router.get("/approved", async (req, res) => {
    try {
        const approvedDoctors = await Doctor.find({ isApproved: true }); // Fetch only approved doctors
        res.json(approvedDoctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get only approved doctors of a given departmnet (Patients can see this)
router.get("/approved/:department", async (req, res) => {
    try {
        const filteredDoctors = await Doctor.find({ isApproved: true, department: req.params.department });
        console.log(filteredDoctors);
        res.json(filteredDoctors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// For admin to approve
router.put("/approve/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        res.json(doctor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** ✅ Update Doctor Profile (Doctor Only) */
router.patch("/update/:doctorId", authMiddleware, doctorMiddleware, async (req, res) => {
    try {
        const { name, email, password, department, specialization, experience, phone, availability } = req.body;
        console.log(req.body);
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        // Hash new password if provided
        if (password) {
            doctor.password = await bcrypt.hash(password, 10);
        }

        // Update only provided fields
        if (name) doctor.name = name;
        if (email) doctor.email = email;
        if (department) doctor.department = department;
        if (specialization) doctor.specialization = specialization;
        if (experience) doctor.experience = experience;
        if (phone) doctor.phone = phone;
        if (availability) doctor.availability = availability;

        await doctor.save();
        res.json({ message: "Doctor profile updated successfully", doctor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/** ✅ Delete Doctor Profile (Admin Only) */
router.delete("/delete/:doctorId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.doctorId);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        res.json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
