// import express from "express";
// import Report from "../models/reportModel.js";
// import { authMiddleware, doctorMiddleware } from "../middleware/authMiddleware.js";
// import cloudinary from "../config/cloudinaryConfig.js";
// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";

// const router = express.Router();

// // Cloudinary Storage for Reports
// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: "patient-reports",
//         format: async (req, file) => "pdf", // Store as PDF
//     },
// });

// const upload = multer({ storage });

// // ✅ Doctor submits a report for a patient
// router.post("/submit", authMiddleware, doctorMiddleware, upload.single("reportFile"), async (req, res) => {
//     try {
//         const { appointmentId, diagnosis, prescription, additionalNotes } = req.body;
//         const doctorId = req.user.id; // Extract doctor ID from JWT

//         const report = new Report({
//             appointmentId,
//             doctorId,
//             patientId: req.body.patientId,
//             diagnosis,
//             prescription,
//             additionalNotes,
//             reportFile: req.file ? req.file.path : null, // Cloudinary URL
//         });

//         await report.save();
//         res.status(201).json({ message: "Report submitted successfully!", report });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // ✅ Patient views their reports
// router.get("/patient", authMiddleware, async (req, res) => {
//     try {
//         const patientId = req.user.id;
//         const reports = await Report.find({ patientId }).populate("doctorId", "name specialization");
//         res.json(reports);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // ✅ Doctor views reports they have created
// router.get("/doctor", authMiddleware, doctorMiddleware, async (req, res) => {
//     try {
//         const doctorId = req.user.id;
//         const reports = await Report.find({ doctorId }).populate("patientId", "name email");
//         res.json(reports);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// export default router;
