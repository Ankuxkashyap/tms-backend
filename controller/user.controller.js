import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { response } from "express";

export const register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists",success:false});
        }
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({name,email,password:hashedPassword});

        await newUser.save();

        const responseUser = {
            name:newUser.name,
            email:newUser.email,
            role:newUser.role,
            _id:newUser._id
        }
        res.status(201).json({message:"User created successfully",user:responseUser,success:true});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error",success:false});
    }        
}
export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found",success:false});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials",success:false});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.cookie("token",token,
            {
                httpOnly:true,
                maxAge: 26*60*60*1000,
                httpOnly: true,
                sameSite: "lax",
            });
        const responseUser = {
            name:user.name,
            email:user.email,
            role:user.role,
            _id:user._id
        }
        res.status(200).json({message:"Login successful", user:responseUser,token,success:true});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error",success:false});
    }
}

export  const getAllUsers = async (req,res)=>{
    try{
        const users = await User.find({},"name").select("-__v -_id").lean();
        res.status(200).json({message:"Users fetched successfully",users,success:true});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error",success:false});
    }
};