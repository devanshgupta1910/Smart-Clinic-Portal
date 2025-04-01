import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate admin credentials from environment variables
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
