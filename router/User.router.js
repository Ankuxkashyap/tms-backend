import { Router } from "express";
import { register, login, getAllUsers } from "../controller/user.controller.js";


const router = Router();


router.get("/", (req, res) => {
    res.send("User Router");
});
router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);

export default router;
