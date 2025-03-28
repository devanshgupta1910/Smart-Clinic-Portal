import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    diagnosis: { type: String, required: true },
    prescription: { type: String, required: true },
    additionalNotes: { type: String },
    reportFile: { type: String }, // Cloudinary URL for PDFs/Images (optional)
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
