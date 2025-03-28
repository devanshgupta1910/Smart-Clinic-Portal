import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctorModel.js";
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
router.put("/update/:doctorId", authMiddleware, doctorMiddleware, async (req, res) => {
    try {
        const { name, email, password, specialization, experience, phone } = req.body;
        const doctor = await Doctor.findById(req.params.doctorId);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });

        // Hash new password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            doctor.password = hashedPassword;
        }

        // Update details
        doctor.name = name || doctor.name;
        doctor.email = email || doctor.email;
        doctor.specialization = specialization || doctor.specialization;
        doctor.experience = experience || doctor.experience;
        doctor.phone = phone || doctor.phone;

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
