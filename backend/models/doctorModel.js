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
        Monday: { type: String, length: 24, default: "000000000000000000000000" },
        Tuesday: { type: String, length: 24, default: "000000000000000000000000" },
        Wednesday: { type: String, length: 24, default: "000000000000000000000000" },
        Thursday: { type: String, length: 24, default: "000000000000000000000000" },
        Friday: { type: String, length: 24, default: "000000000000000000000000" },
        Saturday: { type: String, length: 24, default: "000000000000000000000000" },
        Sunday: { type: String, length: 24, default: "000000000000000000000000" }
    },
    isApproved: { type: Boolean, default: false } // Admin approval required
}, { timestamps: true });

export default mongoose.model("Doctor", doctorSchema);
