import {Router} from "express"
import { CreateTask } from "../controller/task.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/",(req,res)=>{
    res.send("Task Router");
});

router.post("/create",authMiddleware,CreateTask);

export default router;