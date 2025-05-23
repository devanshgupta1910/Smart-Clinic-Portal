import express from "express";
import Prescription from "../models/PrescriptionModel.js";
import { authMiddleware, doctorMiddleware } from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinaryConfig.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Cloudinary Storage for Prescriptions
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "patient-prescriptions", // 🔥 Change folder name if needed
        allowed_formats: ["jpg", "png", "jpeg"], // Allowed image formats
    },
});

const upload = multer({ storage });

// ✅ Doctor submits a prescription for a patient
router.post("/submit", authMiddleware, doctorMiddleware, upload.single("prescriptionURL"), async (req, res) => {
    try {
        const { appointmentId, diagnosis, additionalNotes } = req.body;

        const prescription = new Prescription({
            appointmentId,
            diagnosis,
            additionalNotes,
            prescriptionURL: req.file ? req.file.path : null, // Cloudinary URL
        });

        await prescription.save();
        res.status(201).json({ message: "Prescription submitted successfully!", prescription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:appointmentId", authMiddleware, async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const prescription = await Prescription.findOne({ appointmentId });

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found for this appointment." });
        }

        res.json(prescription);
    } catch (error) {
        console.error("Error fetching prescription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
