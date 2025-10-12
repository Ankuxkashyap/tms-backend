import  jwt  from "jsonwebtoken" 
import User from "../model/user.model.js";

export const authMiddleware = async (req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"No token, authorization denied",success:false});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error",success:false});
    }
}