import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: {
        type: String,
        enum: [
            "Cardiology",
            "Neurology",
            "Orthopedics",
            "Pediatrics",
            "Gynecology",
            "Dermatology",
            "Radiology",
            "Oncology",
            "Urology",
            "Gastroenterology",
            "Psychiatry",
            "ENT",
            "Ophthalmology",
            "Nephrology",
            "Pulmonology",
            "Anesthesiology",
            "Endocrinology",
            "Rheumatology",
            "General Medicine",
            "General Surgery"
        ],

        required: true
    },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // Years of experience
    phone: { type: String, required: true },
    availability: {
        type: [String], // Example: ["Monday", "Wednesday", "Friday"]
        required: false,
    },
    isApproved: { type: Boolean, default: false } // Admin approval required
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
