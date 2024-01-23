import jwt from "jsonwebtoken";
import { User } from "../interface";

export const generateToken = (user: User) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "");
  const cookieMaxAge =
    parseInt(process.env.COOKIE_EXPIRE || "0", 10) * 60 * 60 * 1000;
  return { token, cookieMaxAge };
};
