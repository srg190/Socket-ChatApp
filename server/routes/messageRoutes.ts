import express from "express";
import { isAuthenticatedUser } from "../middleware/auth";
import { sendMessage, getConversation } from "../controller/messageController";
import { errorMiddleware } from "../middleware/error";

const router = express.Router();

router.route("/sendMessage").post(isAuthenticatedUser, sendMessage);
router.route("/getConversation").post(isAuthenticatedUser, getConversation);

export default router;
