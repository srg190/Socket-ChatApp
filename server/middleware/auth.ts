import { PrismaClient } from "@prisma/client";
import ErrorHandler from "./error";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest, User } from "../interface";
import { StatusCodes } from "../constants/statuscode";

const prisma = new PrismaClient();

export const isAuthenticatedUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(
        new ErrorHandler(
          "Please login to access this resource",
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    return next(
      new ErrorHandler(
        "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
