import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.headers.token; 

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = verified; 
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid Token" });
    }
};

export default authMiddleware;
