import {Router} from "express"
import { CreateTask,DeleteTask,EditTask,getOverdueTasks,getTasks,getTasksAssignedToUser,getTasksById,getTasksByQuery,getTasksCreatedByUser, updateTaskStatus} from "../controller/task.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/",(req,res)=>{
    res.send("Task Router");
});
router.post("/create", authMiddleware, CreateTask);
router.get("/getTasks", authMiddleware, getTasks);
router.get("/getTasksAssignedToUser", authMiddleware, getTasksAssignedToUser);
router.get("/getTasksCreatedByUser", authMiddleware, getTasksCreatedByUser);
router.get("/getOverdueTasks", authMiddleware, getOverdueTasks);
router.post("/search", authMiddleware, getTasksByQuery);
router.delete("/delete/:id", authMiddleware, DeleteTask);
router.put("/edit/:id", authMiddleware, EditTask);
router.put("/update/:id", authMiddleware, updateTaskStatus);

// 👇 Keep this last
router.get("/:id", authMiddleware, getTasksById);


export default router;