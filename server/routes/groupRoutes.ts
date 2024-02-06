import express from "express";
import { isAuthenticatedUser } from "../middleware/auth";
import {
  addInGroup,
  createGroup,
  deleteGroup,
  leaveGroup,
  getGroupDetails,
  getGroupUsersList
} from "../controller/groupController";
import { errorMiddleware } from "../middleware/error";

const router = express.Router();

router.route("/createGroup").post(isAuthenticatedUser, createGroup);
router.route("/addInGroup").post(isAuthenticatedUser, addInGroup);
router.route("/deleteGroup").post(isAuthenticatedUser, deleteGroup);
router.route("/leaveGroup").post(isAuthenticatedUser, leaveGroup);
router.route("/getGroupDetails").post(isAuthenticatedUser, getGroupDetails);
router.route("/getGroupUsersList").post(isAuthenticatedUser, getGroupUsersList);

export default router;
