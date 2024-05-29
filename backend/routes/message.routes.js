import express from "express";
import { getMessage, sendMessage } from "../controllers/message.controller.js";
import middleware from "../middleware/middleware.js";

const router = express.Router();

router.get("/:id", middleware, getMessage);
router.post("/send/:id", middleware, sendMessage);

export default router;