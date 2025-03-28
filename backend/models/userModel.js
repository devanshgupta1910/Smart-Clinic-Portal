import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile_number: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model("User", userSchema);