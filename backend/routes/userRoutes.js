import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    const { name, mobile_number, email, password, dob } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, mobile_number, email, password: hashedPassword, dob });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: "Invalid password" });
        const token = jwt.sign({ id: user._id, role: "patient" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/profile", authMiddleware, async (req, res) => {
    try {    
      console.log(req.user.id);
      const patient = await User.findById(req.user.id).select("-password"); // Exclude password
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.status(200).json(patient);
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      res.status(500).json({ message: "Server error" });
    }
});

/** ✅ Update Patient Profile (Patient Only) */
router.put("/update", authMiddleware, async (req, res) => {
    try {
        const { name, email, password, phone, age } = req.body;
        const patient = await User.findById(req.user.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        // Hash new password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            patient.password = hashedPassword;
        }

        // Update details
        patient.name = name || patient.name;
        patient.email = email || patient.email;
        patient.phone = phone || patient.phone;
        patient.age = age || patient.age;

        await patient.save();
        res.json({ message: "Patient profile updated successfully", patient });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/** ✅ Delete Patient Profile (Admin Only) */
router.delete("/delete/:patientId", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const patient = await User.findByIdAndDelete(req.params.patientId);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
