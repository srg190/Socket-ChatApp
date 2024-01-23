import express from "express";
import { isAuthenticatedUser } from "../middleware/auth";
import {
  addInGroup,
  createGroup,
  deleteGroup,
  leaveGroup,
} from "../controller/groupController";

const router = express.Router();

router.route("/createGroup").post(isAuthenticatedUser, createGroup);
router.route("/addInGroup").post(isAuthenticatedUser, addInGroup);
router.route("/deleteGroup").post(isAuthenticatedUser, deleteGroup);
router.route("/leaveGroup").post(isAuthenticatedUser, leaveGroup);
export default router;
