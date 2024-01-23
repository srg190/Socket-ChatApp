import express from "express";
import {
  getAllUser,
  registerUser,
  loginUser,
  logout,
} from "../controller/userController";
import { errorMiddleware } from "../middleware/error";
import { isAuthenticatedUser } from "../middleware/auth";

const router = express.Router();

//register, login
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/allUsers").get(isAuthenticatedUser, getAllUser);
router.route("/logout").post(isAuthenticatedUser, logout);
router.use(errorMiddleware);
export default router;
