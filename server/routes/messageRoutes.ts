import express from "express";
import { isAuthenticatedUser } from "../middleware/auth";
import { sendMessage } from "../controller/messageController";

const router = express.Router();

router.route("/sendMessage").post(isAuthenticatedUser, sendMessage);

export default router;
