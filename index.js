import express  from "express"
import { config } from "dotenv";
import conn from "./config/db.js";
import UserRouter from "./router/User.router.js";
import TaskRouter from "./router/Task.router.js";
import cookieParser from 'cookie-parser'
import cors from "cors"

config();

const app = express();

conn();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST","DELETE","PUT"],
    credentials:true,
}))

app.get('/',(req,res)=>{
    res.send("All Good 💀")
})

app.use('/api/user',UserRouter)
app.use('/api/task',TaskRouter)

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
