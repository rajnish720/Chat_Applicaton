import express from "express";
import { LogoutUser, loginUser, signUpUser } from "../controllers/auth.controller.js";

const app = express();
const router = express.Router();

router.post("/signup", signUpUser);

router.post("/login", loginUser);

router.post("/logout", LogoutUser);

export default router;
