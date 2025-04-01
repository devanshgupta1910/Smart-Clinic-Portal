import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    diagnosis: { type: String, required: true },
    additionalNotes: { type: String },
    prescriptionFile: { type: String }, // Cloudinary URL for PDFs/Images (optional)
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
