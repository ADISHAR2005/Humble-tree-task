import express from "express";
import { loginUser,getUsers } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/", getUsers);

export default router;