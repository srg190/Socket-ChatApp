import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../middleware/error";
import { StatusCodes } from "../constants/statuscode";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/cookie";
import { CustomRequest, Token } from "../interface";

const prisma = new PrismaClient();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, userName, password } = req.body;
    if (!email || !userName || !password) {
      return next(
        new ErrorHandler(
          "Please input all valid fields",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return next(
        new ErrorHandler("User already exist", StatusCodes.BAD_REQUEST)
      );
    }

    const existingUserName = await prisma.user.findUnique({
      where: { userName },
    });
    if (existingUserName) {
      return next(
        new ErrorHandler("User already exist", StatusCodes.BAD_REQUEST)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        userName,
        password: hashedPassword,
      },
    });
    const { token, cookieMaxAge } = generateToken(user);

    res
      .status(StatusCodes.CREATED)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: cookieMaxAge,
      })
      .json({
        message: "User created successfull",
        user: { ...user, password: "" },
        token,
        success: true,
      });
  } catch (error) {
    return next(
      new ErrorHandler("Please re-try", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, userName, password } = req.body;
    console.log(email, "email", userName, "userName", password, "password");
    if (!email && !userName) {
      console.log("fired userName");
      return next(
        new ErrorHandler(
          "Please enter email or username",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    if (!password) {
      console.log("fired password");
      return next(
        new ErrorHandler(
          "Please enter valid username or password",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { userName }],
      },
    });

    if (!user) {
      return next(new ErrorHandler("User not found", StatusCodes.NOT_FOUND));
    }

    let isMatch = false;
    if (user) {
      console.log("pahuncha password tak", user.password);
      isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
    }

    if (!isMatch) {
      console.log("fired match");
      return next(
        new ErrorHandler(
          "Please enter valid username or password",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    let getToken: Token = {
      token: "",
      cookieMaxAge: 0,
    };
    if (user) getToken = generateToken(user);
    const User = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isOnline: true,
      },
      include: {
        // groupAdmin: true,
        groups: true,
      },
    });

    res
      .status(StatusCodes.OK)
      .cookie("token", getToken.token, {
        httpOnly: true,
        maxAge: getToken.cookieMaxAge,
      })
      .json({
        message: "User logged in successfull",
        user: { ...User, password: "" },
        token: getToken.token,
        success: true,
      });
  } catch (error) {
    return next(
      new ErrorHandler("Please re-try", StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

export const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.user.update({
      where: {
        id: req.user && req.user.id,
      },
      data: {
        isOnline: false,
        lastSeen: new Date(),
      },
    });
    res
      .status(StatusCodes.OK)
      .cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
      })
      .json({
        message: "Logout successful",
        success: true,
      });
  } catch (error) {
    return next(
      new ErrorHandler(
        "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        isOnline: true,
        userName: true,
        lastSeen: true,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Fetched all user successfully",
      users,
    });
  } catch (error) {
    return next(new ErrorHandler("Please re-try", StatusCodes.BAD_REQUEST));
  }
};
