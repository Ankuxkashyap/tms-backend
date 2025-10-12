import {Router} from "express"
import { CreateTask,getOverdueTasks,getTasks,getTasksAssignedToUser,getTasksByQuery,getTasksCreatedByUser, updateTaskStatus} from "../controller/task.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/",(req,res)=>{
    res.send("Task Router");
});

router.post("/create",authMiddleware,CreateTask);
router.get("/getTasks",authMiddleware,getTasks);
router.get("/getTasksAssignedToUser",authMiddleware,getTasksAssignedToUser);
router.get("/getTasksCreatedByUser",authMiddleware,getTasksCreatedByUser);
router.post("/search",authMiddleware,getTasksByQuery)
router.get("/getOverdueTasks",authMiddleware,getOverdueTasks);
router.put("/update/:id",authMiddleware,updateTaskStatus);


export default router;