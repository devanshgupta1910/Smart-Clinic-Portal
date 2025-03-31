import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // Added time slot field
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
