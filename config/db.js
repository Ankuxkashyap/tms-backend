import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const conn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI  || "mongodb://127.0.0.1:27017/taskify");
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
};

export default conn;