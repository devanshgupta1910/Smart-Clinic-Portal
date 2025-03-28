import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // Years of experience
    phone: { type: String, required: true },
    availability: {
        type: [String], // Example: ["Monday", "Wednesday", "Friday"]
        required: true,
    },
    isApproved: { type: Boolean, default: false } // Admin approval required
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
