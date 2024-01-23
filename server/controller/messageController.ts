import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../middleware/error";
import { StatusCodes } from "../constants/statuscode";
import { CustomRequest } from "../interface";

const prisma = new PrismaClient();

export const sendMessage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId, recipitantId, text } = req.body;
    if (!text) {
      return next(
        new ErrorHandler(
          "Can not process empty contents",
          StatusCodes.METHOD_NOT_ALLOWED
        )
      );
    }

    if (!(groupId || recipitantId)) {
      return next(
        new ErrorHandler(
          "Please provide either groupId or recipitantId",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const sendById = req.user && req.user.id;
    if (!sendById) {
      return next(
        new ErrorHandler(
          "User ID is undefined",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }

    const result = await prisma.user.update({
      where: {
        id: sendById,
      },
      data: {
        sentByMessages: {
          create: [
            {
              text: text,
              sendToId: recipitantId,
              sendToGroupId: groupId,
            },
          ],
        },
      },
      include: {
        sentByMessages: true,
      },
    });

    res.status(StatusCodes.ACCEPTED).json({
      message: "Message sent successfully",
      success: true,
      data: { ...result, password: "" },
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
