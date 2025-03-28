import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: user._id, role: "admin" or "doctor" }
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const doctorMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "doctor") {
        return res.status(403).json({ message: "Access denied, doctors only" });
    }
    next();
};

const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied, admin only" });
    }
    next();
};

export { authMiddleware, adminMiddleware, doctorMiddleware };