import  jwt  from "jsonwebtoken" 
import User from "../model/user.model.js";

export const authMiddleware = async (req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({ message: "No token, authorization denied", success: false });
        }
        console.log(token);

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch(err) {
            return res.status(401).json({ message: "Token is invalid or expired", success: false });
        }

        req.user = await User.findById(decoded.id).select("-password");
        if(!req.user) {
            return res.status(401).json({ message: "User not found", success: false });
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}