import {Router} from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {getNotificationsByUser,updateReadNotification,showMoreNotifications} from "../controller/notifaction.controller.js"


const router = Router();

router.get("/",authMiddleware,getNotificationsByUser);
router.get('/showMore',authMiddleware,showMoreNotifications)
router.put("/updateReadNotification",authMiddleware, updateReadNotification);


export default router